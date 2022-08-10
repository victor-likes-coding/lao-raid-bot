import fs from "fs";
import path from "path";
import { ActionRowBuilder, SelectMenuBuilder, SelectMenuComponentOptionData } from "discord.js";
import { addDoc, collection, doc, DocumentData, getDoc, getDocs, QuerySnapshot } from "firebase/firestore";
import { fileExists } from "../utils/file";
import { db } from "../utils/client";
import { async } from "@firebase/util";

const times: string[] = [];

for (let i = 0; i < 24; i++) {
    times.push(`${Math.floor(i / 10)}${i % 10}:00`);
}

export type RaidType = {
    // This is for DB
    type?: number;
    time?: number;
    characters?: [];
    active?: boolean;
};

export type ClassType = {
    // This is for DB
    name?: string;
    firstEngraving?: string;
    secondEngraving?: string;
    synergy?: string;
    type?: string;
};

export type RaidContent = {
    name?: string;
    id?: string;
    ilevel?: number;
    memberLimit?: number;
};

export type ClassContent = {
    name?: string;
    id?: string;
    firstEngraving?: string;
    secondEngraving?: string;
    synergy?: string;
    type?: "DPS" | "Support";
};

export type RaidJSON = {
    [name: string]: {
        id: string;
        ilevel: number;
        memberLimit: number;
    };
};

type MenuItem = {
    label: string;
    value: string;
};

type Menu = {
    [key: string]: MenuItem[];
};

type RaidConfiguration = {
    [key: string]: {
        date?: string;
        time?: number;
        raid?: number;
    };
};

export class Raid {
    // tag should be a discord tag
    static menus: Menu = {};
    static selectMenus: { [key: string]: ActionRowBuilder<SelectMenuBuilder> } = {};
    static __currentUpdater: string = "";
    static __updaterId: string = null;
    static pathToRaidFile = path.join(__dirname, "..", "data", "raid.json");
    static pathToClassFile = path.join(__dirname, "..", "data", "class.json");

    static raids: RaidConfiguration = {};

    static addRaidDetails = (user: string, key: "date" | "time" | "raid", value: string | number): void => {
        if (!Raid.raids[user]) {
            Raid.raids[user] = {};
        }

        if (key === "date") {
            Raid.raids[user][key] = value as string;
        } else if (key === "raid" || key === "time") {
            Raid.raids[user][key] = value as number;
        }
    };

    static generateMenu = (list: string[]): MenuItem[] => {
        return list.reduce((prev, current, index: number) => {
            return prev.concat({
                label: current,
                value: index.toString(),
            });
        }, []);
    };

    static setup = async () => {
        // sets up the menus of the raid object
        await Raid.loadData("raid-types", Raid.pathToRaidFile);
        await Raid.loadData("classes", Raid.pathToClassFile);

        // we have actual raids menu and a dates menu as well as a time menu
        // raid menu
        this.menus["date"] = Raid.generateMenu(["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"]);
        this.menus["time"] = Raid.generateMenu(times);

        // selectmenus
        this.selectMenus["raid"] = Raid.createSelectMenus("raid", "Select Raid");
        this.selectMenus["date"] = Raid.createSelectMenus("date", "Select Date");
        this.selectMenus["time"] = Raid.createSelectMenus("time", "Select Time");
    };

    static createSelectMenus = (type: string, placeholder: string): ActionRowBuilder<SelectMenuBuilder> => {
        return new ActionRowBuilder().addComponents(
            new SelectMenuBuilder()
                .setCustomId(type)
                .setPlaceholder(placeholder)
                .addOptions(this.menus[type] as SelectMenuComponentOptionData[])
        ) as ActionRowBuilder<SelectMenuBuilder>;
    };

    static loadData = async (type: string, filePath: string) => {
        if (!fileExists(filePath)) {
            const data = JSON.stringify({});
            fs.writeFileSync(filePath, data);
        }

        const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8") || JSON.stringify({}));

        if (type === "raid-types") {
            // load data from db
            const docs = await Raid.get(type);
            docs.forEach((doc) => {
                const data = doc.data();
                parsed[data.name] = {
                    id: doc.id,
                    ilevel: data.ilevel,
                    memberLimit: data.memberLimit,
                };
            });
            this.menus["raid"] = Raid.generateMenu(Object.keys(parsed));
            // store this back into that raid.json
            const data = JSON.stringify(parsed);
            fs.writeFileSync(Raid.pathToRaidFile, data);
        }

        if (type === "classes") {
            const docs = await Raid.get(type);
            docs.forEach((doc) => {
                const data = doc.data();
                parsed[data.name] = {
                    id: doc.id,
                    firstEngraving: data.firstEngraving,
                    secondEngraving: data.secondEngraving,
                    synergy: data.synergy,
                    type: data.type,
                };
            });

            // store this back into that class.json
            const data = JSON.stringify(parsed);
            fs.writeFileSync(filePath, data);
        }
    };

    static getUpdater = () => {
        return this.__currentUpdater;
    };

    static addUpdater = (tag: string) => {
        this.__currentUpdater = tag;
        return this;
    };

    static getUpdaterId = () => {
        return this.__updaterId;
    };

    static addUpdaterId = (id: string) => {
        this.__updaterId = id;
        return this;
    };

    static getLocalRaidDetails = (user: string) => {
        // get all of the raids that are locally stored
        return Raid.raids[user];
    };

    // DB functions
    static add = async (raid: RaidType) => {
        /**
         * @raid is an object
         * {
         *      date: string
         *      type: number
         *      time: string
         *      characters: [Character.id]
         *      active: boolean
         * }
         */
        try {
            // ! check for those requirements
            const docRef = await addDoc(collection(db, "raids"), raid);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    static get = async (table: string): Promise<QuerySnapshot<DocumentData>> => {
        try {
            return await getDocs(collection(db, table));
        } catch (e) {
            console.log(`Something went wrong with getting ${table} collection`);
            return;
        }
    };

    static getById = async (id: string) => {
        const raidRef = doc(db, "raids", id);
        try {
            return await getDoc(raidRef);
        } catch (e) {
            console.log("Something went wrong with getting a raid by ID");
            return new Promise((res) => {
                res([]);
            });
        }
    };

    static addRaidContent = async (options: RaidContent) => {
        // Check and see if we have that raid already by checking local file

        return await addDoc(collection(db, "raid-types"), options);
    };

    static addClassContent = async (options: ClassContent) => {
        return await addDoc(collection(db, "classes"), options);
    };
}

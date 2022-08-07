import {
    ActionRowBuilder,
    AnyComponentBuilder,
    APISelectMenuOption,
    SelectMenuBuilder,
    SelectMenuComponentOptionData,
    SelectMenuOptionBuilder,
} from "discord.js";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../utils/client";

const times: string[] = [];

for (let i = 0; i < 24; i++) {
    times.push(`${Math.floor(i / 10)}${i % 10}:00`);
}

export type RaidType = {
    type?: number;
    time?: number;
    characters?: [];
    active?: boolean;
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

    static setup = () => {
        // sets up the menus of the raid object

        // we have actual raids menu and a dates menu as well as a time menu
        // raid menu
        this.menus["raid"] = Raid.generateMenu(["Argos P1", "Argos P2", "Argos P3", "Valtan NM", "Valtan HM", "Vykas NM", "Vykas HM"]);
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

    static get = async () => {
        try {
        } catch (e) {}
    };
}

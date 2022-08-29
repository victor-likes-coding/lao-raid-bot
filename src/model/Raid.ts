import fs from "fs";
import moment from "moment";
import { ActionRowBuilder, CacheType, CommandInteractionOption, SelectMenuBuilder } from "discord.js";
import { addDoc, collection, doc, DocumentData, getDoc, getDocs, getDocsFromServer, QuerySnapshot } from "firebase/firestore";
import { Base } from "./Base";
import { db } from "../utils/client";
import path from "path";

const classType = {
    Deathblade: "Assassin",
    Shadowhunter: "Assassin",
    Sorceress: "Mage",
    Bard: "Mage",
    Arcanist: "Mage",
    Deadeye: "Gunner",
    Sharpshooter: "Gunner",
    Gunslinger: "Gunner",
    Artillerist: "Gunner",
    Glaivier: "Martial Artist",
    Scrapper: "Martial Artist",
    Soulfist: "Martial Artist",
    Wardancer: "Martial Artist",
    Striker: "Martial Artist",
    Paladin: "Warrior",
    Berserker: "Warrior",
    Gunlancer: "Warrior",
    Destroyer: "Warrior",
};
const times: string[] = [];

for (let i = 0; i < 24; i++) {
    times.push(`${Math.floor(i / 10)}${i % 10}:00`);
}

export type RaidType = {
    // This is for DB
    type?: string;
    time?: number;
    characters?: [];
    active?: boolean;
    users?: [];
};

export type SpecificEngravings = {
    Assassin?: {
        [key: string]: Item[];
    };
    Mage?: {
        [key: string]: Item[];
    };
    Gunner?: {
        [key: string]: Item[];
    };
    "Martial Artist"?: {
        [key: string]: Item[];
    };
    Warrior?: {
        [key: string]: Item[];
    };
};

export type CharacterClasses = "Assassin" | "Mage" | "Gunner" | "Martial Artist" | "Warrior";
export type Characters =
    | "Deathblade"
    | "Shadowhunter"
    | "Sorceress"
    | "Bard"
    | "Arcanist"
    | "Deadeye"
    | "Sharpshooter"
    | "Gunslinger"
    | "Artillerist"
    | "Glaivier"
    | "Scrapper"
    | "Soulfist"
    | "Wardancer"
    | "Striker"
    | "Paladin"
    | "Berserker"
    | "Gunlancer"
    | "Destroyer";

export type RaidContent = {
    name?: string;
    id?: string;
    ilevel?: number;
    memberLimit?: number;
};

type option = {
    label: string;
    description: string;
    value: number;
};

export type RaidJSON = {
    [name: string]: {
        id: string;
        ilevel: number;
        memberLimit: number;
    };
};

export type RaidModel = {
    id: string;
    characters?: string[];
    time?: number;
    type?: string; // can be used to look up raid-type information
    users?: string[];
};

type Item = {
    name: string;
    value: string;
};

export type Menu = {
    [key: string]: Item[];
};

type RaidSelection = {
    [user: string]: {
        raid: string;
        character?: string;
    };
};

export class Raid extends Base<RaidType, RaidContent, RaidJSON, RaidModel> {
    // tag should be a discord tag
    static menus: Menu = {};
    static raidTypes: RaidJSON = {};
    static table = "raids";
    static filePath = path.join(__dirname, "..", "data", "raid.json");
    static localSelectMenuSelections: RaidSelection = {};

    static generateMenu = (list: string[]): Item[] => {
        return list.reduce((prev, current, index: number) => {
            return prev.concat({
                name: current,
                value: current,
            });
        }, []);
    };

    static setup = async () => {
        // sets up the menus of the raid object
        await this.load();

        // raid menu
        this.menus["date"] = Raid.generateMenu(["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"]);
        this.menus["time"] = Raid.generateMenu(times);
    };

    static async getByDate(date?: string) {
        // get start of day
        const raids: RaidModel[] = [];
        const ref = await getDocsFromServer(collection(db, this.table));

        ref.forEach((doc) => {
            const data = doc.data();
            if (date) {
                if (data.time > Date.now()) {
                    const raidDate = moment(data.time).format("dddd");
                    if (raidDate === date) {
                        raids.push({
                            id: doc.id,
                            ...data,
                        });
                    }
                }
            } else {
                if (data.time > Date.now()) {
                    raids.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                }
            }
        });

        // get all raids within start / end

        return raids;
    }

    // End DB functions

    static createRaidObject = (data: readonly CommandInteractionOption<CacheType>[]): RaidType => {
        const [{ value: raidValue }, { value: dateValue }, { value: timeValue }] = data;

        const raid = raidValue as string;
        const time = Number.parseInt((timeValue as string).split(":")[0]);
        const date = dateValue as string;

        return {
            time:
                new Date(moment().day(date).hour(time).startOf("hour").toString()).getTime() < Date.now()
                    ? new Date(moment().day(date).hour(time).startOf("hour").toString()).getTime() + 60 * 60 * 24 * 7 * 1000
                    : new Date(moment().day(date).hour(time).startOf("hour").toString()).getTime(),
            type: raid,
            characters: [],
            active: true,
            users: [],
        };
    };

    static showRaids = async (date: string | undefined) => {
        const raids = await Raid.get();
        let index = 1;
        let dateStrings: string[] = [];

        raids.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // Only grab docs where the time > now
            // check now and compare to doc.time and see if now > doc.time
            // only return raids where doc.time > now
            // turn doc into a Raid object

            const raidDoc = doc.data();
            if (date) {
                // turn raidDoc.time into a date
                if (raidDoc.time > Date.now()) {
                    const raidDate = moment(raidDoc.time).format("dddd");
                    if (raidDate === date) {
                        const dateInfo = moment(raidDoc.time).format("MM/DD dddd @ HH:mm ZZ");
                        dateStrings.push(
                            `\`\`\`${index++}. ${raidDoc.type}\nWhen: ${dateInfo}\nMembers: ${raidDoc.characters.length} / ${
                                Raid.raidTypes[raidDoc.type].memberLimit
                            }\`\`\`\n`
                        );
                    }
                }
            } else {
                if (raidDoc.time > Date.now()) {
                    const dateInfo = moment(raidDoc.time).format("MM/DD dddd @ HH:mm ZZ");
                    dateStrings.push(
                        `\`\`\`${index++}. ${raidDoc.type}\nWhen: ${dateInfo}\nMembers: ${raidDoc.characters.length} / ${
                            Raid.raidTypes[raidDoc.type].memberLimit
                        }\`\`\`\n`
                    );
                }
            }
        });
        if (date && dateStrings.length > 0) {
            dateStrings.unshift(`Showing raids on ${date}:\n`);
        }

        return dateStrings.join("") || "No raids found.";
    };

    static async parseData(docs: QuerySnapshot<DocumentData>) {
        // loads the local file
        let parsed: RaidJSON = JSON.parse(fs.readFileSync(this.filePath, "utf-8") || JSON.stringify({}));

        // goes through and updates the keys, and values, and adds any new ones
        docs.forEach((doc) => {
            const data = doc.data();
            parsed[data.name] = {
                id: doc.id,
                ilevel: data.ilevel,
                memberLimit: data.memberLimit,
            };
        });
        // parses the raid types into the raid menu
        this.menus["raid"] = Raid.generateMenu(Object.keys(parsed));
        return parsed;
    }

    static async load() {
        this.createJSONFile();
        const docs = await Raid.getData("raid-types");
        const parsed = await this.parseData(docs);
        this.storeLocalData(parsed);
        this.raidTypes = parsed;
    }

    static createSelectMenu(data: RaidModel[]): ActionRowBuilder<SelectMenuBuilder> {
        const options = data.map((raid, index) => {
            return {
                label: `${raid.type} @ ${moment(raid.time).format("MM/DD dddd @ HH:mm ZZ")}`,
                description: `${raid.characters.length} / ${this.raidTypes[raid.type].memberLimit} members`,
                value: raid.id,
            };
        });
        const menu = new ActionRowBuilder<SelectMenuBuilder>().setComponents(
            new SelectMenuBuilder().setCustomId("raid").setPlaceholder("Choose a raid").setOptions(options)
        );
        return menu;
    }

    static isExpired(raid: RaidModel) {
        // check and see if the current time Date.now() is > raid.time
        return Date.now() > raid.time;
    }

    static userInRaid(users: string[], user: string) {
        console.log(users);
        return !!users.filter((u) => u === user).length;
    }
}

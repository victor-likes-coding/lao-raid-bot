import fs from "fs";
import moment from "moment";
import { CacheType, CommandInteractionOption } from "discord.js";
import { addDoc, collection, doc, DocumentData, getDoc, getDocs, QuerySnapshot } from "firebase/firestore";
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

export type RaidJSON = {
    [name: string]: {
        id: string;
        ilevel: number;
        memberLimit: number;
    };
};

type Item = {
    name: string;
    value: string;
};

export type Menu = {
    [key: string]: Item[];
};

export class Raid extends Base<RaidType, RaidContent, RaidJSON> {
    // tag should be a discord tag
    static menus: Menu = {};
    static raidTypes: RaidJSON = {};
    static table = "raids";
    static filePath = path.join(__dirname, "..", "data", "raid.json");

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
                            `\`\`\`${index++}. ${raidDoc.type}\nWhen: ${dateInfo}\nSpace: ${raidDoc.characters.length} / ${
                                Raid.raidTypes[raidDoc.type].memberLimit
                            }\`\`\`\n`
                        );
                    }
                }
            } else {
                if (raidDoc.time > Date.now()) {
                    const dateInfo = moment(raidDoc.time).format("MM/DD dddd @ HH:mm ZZ");
                    dateStrings.push(
                        `\`\`\`${index++}. ${raidDoc.type}\nWhen: ${dateInfo}\nSpace: ${raidDoc.characters.length} / ${
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
        const docs = await Raid.getData();
        const parsed = await this.parseData(docs);
        this.storeLocalData(parsed);
        this.raidTypes = parsed;
    }
}

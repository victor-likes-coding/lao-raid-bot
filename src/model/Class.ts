import fs from "fs";
import { collection, DocumentData, getDocs, query, QuerySnapshot, where } from "firebase/firestore";
import path from "path";
import { db } from "../utils/client";
import { Base } from "./Base";
import { Menu } from "./Raid";

export type ClassType = {
    // This is for DB
    name?: string;
    firstEngraving?: string;
    secondEngraving?: string;
    synergy?: string;
    type?: string;
    table: string;
};

export type ClassContent = {
    name?: string;
    id?: string;
    firstEngraving?: string;
    secondEngraving?: string;
    synergy?: string;
    type?: "DPS" | "Support";
};

export type ClassJSON = {
    [name: string]: {
        id?: string;
        firstEngraving?: string;
        secondEngraving?: string;
        synergy?: string;
        type?: "DPS" | "Support";
    };
};

export class Class extends Base<ClassContent, ClassType, ClassJSON> {
    static table = "classes";
    static filePath = path.join(__dirname, "..", "data", "class.json");
    static engravings: ClassJSON = {};

    static setup = async () => {
        await this.load();
    };

    static async parseData(docs: QuerySnapshot<DocumentData>) {
        // loads the local file
        let parsed: ClassJSON = JSON.parse(fs.readFileSync(this.filePath, "utf-8") || JSON.stringify({}));

        // goes through and updates the keys, and values, and adds any new ones
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
        return parsed;
    }

    static async load() {
        this.createJSONFile();
        const docs = await this.getData();
        const parsed = await this.parseData(docs);
        this.storeLocalData(parsed);
        this.engravings = parsed;
    }

    static async getClass(data: string): Promise<string> {
        let characterClassId = null;
        const ref = query(collection(db, this.table), where("name", "==", data));
        try {
            const docs = await getDocs(ref);
            docs.forEach((doc) => {
                if (doc.data().name === data) {
                    characterClassId = doc.id;
                }
            });

            if (!characterClassId) {
                Promise.reject("Could not find that class");
            }

            return characterClassId || "";
        } catch (e) {
            throw Error(`Could not find a class named: ${data}`);
        }
    }
}

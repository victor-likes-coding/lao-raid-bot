import { addDoc, collection } from "firebase/firestore";
import path from "path";
import { db } from "../utils/client";

export type GenericType = {
    table: string;
};

export class Base<C, T, J> {
    static raidFilePath = path.join(__dirname, "..", "data", "raid.json");
    static classFilePath = path.join(__dirname, "..", "data", "class.json");

    static async add<T extends GenericType>(options: T) {
        const { table, ...rest } = options;
        try {
            const doc = await addDoc(collection(db, table), rest);
            return doc;
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    static getLocalData(type: string) {}

    static setUp() {}
}

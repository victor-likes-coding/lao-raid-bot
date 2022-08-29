import fs from "fs";
import { addDoc, collection, doc, getDoc, getDocsFromServer, setDoc } from "firebase/firestore";
import path from "path";
import { fileExists } from "../utils/file";
import { db } from "../utils/client";

export type GenericType = {
    table: string;
};

type GenericModel = {
    id: string;
};

export class Base<Content, Type, Json, Model> {
    static table = "";
    static filePath = "";

    // db functions below

    static async add<Content>(options: Content, tableName?: string) {
        try {
            const doc = await addDoc(collection(db, tableName || this.table), options);
            return doc;
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    /*
     * gets the collection of documents for this table
     */
    static async get(tableName?: string) {
        try {
            return await getDocsFromServer(collection(db, tableName || this.table));
        } catch (e) {
            throw Error(`Problem with getting docs from server, ${e.message}`);
        }
    }

    static async getById(id: string) {
        const raidRef = doc(db, this.table, id);
        try {
            const docs = await getDoc(raidRef);
            return {
                id: docs.id,
                ...docs.data(),
            };
        } catch (e) {
            console.log("Something went wrong with getting a raid by ID");
            return new Promise((res) => {
                res({});
            });
        }
    }

    static async update<Model extends GenericModel>(data: Model) {
        const ref = doc(db, this.table, data.id);
        try {
            await setDoc(ref, data, { merge: true });
        } catch (e) {
            throw Error(`Updating document failed.`);
        }
    }

    // db fns end

    // creates a json file for the filepath if it doesn't exist
    static async createJSONFile() {
        if (!fileExists(this.filePath)) {
            const data = JSON.stringify({});
            fs.writeFileSync(this.filePath, data);
        }
    }

    static storeLocalData<Content>(parsed: Content) {
        const data = JSON.stringify(parsed);
        fs.writeFileSync(this.filePath, data);
    }

    static async getData(tableName?: string) {
        try {
            return this.get(tableName || this.table);
        } catch (e) {
            throw Error(`Can't get data to be parsed in load operation.`);
        }
    }
}

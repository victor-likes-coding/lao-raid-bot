import { addDoc, collection } from "firebase/firestore";
import { db } from "../utils/client";
import { Base } from "./Base";

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
    static addClassContent = async (options: ClassContent) => {
        return await addDoc(collection(db, "classes"), options);
    };
}

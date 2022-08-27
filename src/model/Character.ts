import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/client";
import { Base } from "./Base";

type LostArkClasses = {
    [key: string]: {
        firstEngraving: string;
        secondEngraving: string;
    };
};

export type CharacterType = {
    table: string;
};

export type CharacterContent = {};

export type CharacterJSON = {};

export class Character extends Base<CharacterType, CharacterContent, CharacterJSON> {
    static table = "characters";
    classes: LostArkClasses = {};

    static async exists(name: string) {
        const ref = query(collection(db, this.table), where("name", "==", name));
        const docs = await getDocs(ref);
        docs.forEach((character) => {
            if (character.data().name === name) {
                return true;
            }
        });
        return false;
    }
}

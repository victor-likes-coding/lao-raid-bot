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

export type CharacterModel = {
    class: string;
    name: string;
    owner: string;
    ilvl: number;
    user: string;
};

export class Character extends Base<CharacterType, CharacterContent, CharacterJSON> {
    static table = "characters";
    classes: LostArkClasses = {};

    static async exists(name: string) {
        let exists = false;
        const ref = query(collection(db, this.table), where("name", "==", name));
        const docs = await getDocs(ref);
        docs.forEach((character) => {
            if (character.data().name === name) {
                exists = true;
                return;
            }
        });
        return exists;
    }
}

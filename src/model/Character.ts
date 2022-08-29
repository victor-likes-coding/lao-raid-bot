import { ActionRowBuilder, SelectMenuBuilder } from "discord.js";
import { collection, DocumentData, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/client";
import { Base } from "./Base";
import { Class } from "./Class";

type LostArkClasses = {
    [key: string]: {
        firstEngraving: string;
        secondEngraving: string;
    };
};

export type CharacterType = {
    table: string;
};

export type CharacterContent = {
    class: string;
    name: string;
    owner: string;
    user: string;
    raid: string;
};

export type CharacterJSON = {};

export type CharacterModel = {
    class: string;
    name: string;
    owner: string;
    ilvl: number;
    user: string;
    raid: string;
};

export type CharacterDataModel = {
    class: string;
    name: string;
    owner: string;
    ilvl: number;
    user: string;
    id: string;
    raid: string;
};

export class Character extends Base<CharacterType, CharacterContent, CharacterJSON, CharacterDataModel> {
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

    static createSelectMenu(data: CharacterDataModel[]): ActionRowBuilder<SelectMenuBuilder> {
        const options = data.map((character) => {
            const classData = Class.classById[character.class];
            return {
                label: `${character.name} - ${classData.name} - ${character.ilvl}`,
                description: `Synergy: ${classData.synergy}`,
                value: character.id,
            };
        });
        const menu = new ActionRowBuilder<SelectMenuBuilder>().setComponents(
            new SelectMenuBuilder().setCustomId("character").setPlaceholder("Choose a character").setOptions(options)
        );
        return menu;
    }

    static async getByOwnerId(id: string) {
        const ref = query(collection(db, this.table), where("owner", "==", id));
        const chars: CharacterDataModel[] = [];
        try {
            const docs = await getDocs(ref);
            docs.forEach((doc) => {
                chars.push({
                    id: doc.id,
                    ...doc.data(),
                } as CharacterDataModel);
            });

            return chars;
        } catch (e) {
            throw Error("Someting went wrong getting characters owned by a specific user");
        }
    }
}

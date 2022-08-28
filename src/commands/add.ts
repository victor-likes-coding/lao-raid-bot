import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { addDoc, collection, doc, DocumentData, DocumentReference, getDocs, query, QueryDocumentSnapshot, setDoc, where } from "firebase/firestore";
import { db } from "../utils/client";
import { Raid } from "../model/Raid";
import { User } from "../model/User";
import { Character, CharacterModel } from "../model/Character";
import { Class } from "../model/Class";

const data = new SlashCommandBuilder()
    .setName("add")
    .setDescription("Allows a user to add a character")
    .addStringOption((option) => option.setName("name").setDescription("Set your character's name").setRequired(true))
    .addStringOption((option) => {
        return option
            .setName("class")
            .setDescription("Choose a class from list provided")
            .setRequired(true)
            .addChoices(
                ...Object.keys(Class.engravings).map((className) => ({
                    name: className,
                    value: className,
                }))
            );
    })
    .addStringOption((option) => option.setName("ilvl").setDescription("Tell us the item level of character").setRequired(true));

export const command = {
    data,
    async execute(interaction: CommandInteraction) {
        // get the class, engraving, item level
        const [characterData, ...rest] = interaction.options.data;
        try {
            let isDuplicateCharacter = await Character.exists(characterData.value as string);
            if (isDuplicateCharacter) {
                return await interaction.reply({ content: "This character's name exists already.", ephemeral: true });
            }
        } catch (e) {
            return await interaction.reply({ content: "Something went wrong getting characters", ephemeral: true });
        }

        const [classData, ilevelData] = rest;
        const { id } = interaction.user;
        try {
            let document = await User.getByDiscordId(id);
            let user = null;

            // handle checking if user exists
            const firebaseDoc = await User.exists(document, id);
            if ("data" in firebaseDoc) {
                user = (firebaseDoc as QueryDocumentSnapshot<DocumentData>).data();
            }
            let characterClassId = null;

            try {
                characterClassId = await Class.getClass(classData.value as string);
            } catch (e) {
                return await interaction.reply({ content: "Something went wrong getting classes", ephemeral: true });
            }

            // create the character
            let character: CharacterModel = {
                class: characterClassId,
                owner: id, // discord id
                name: characterData.value as string,
                ilvl: Number.parseInt(ilevelData.value as string),
                user: firebaseDoc.id, // should be document id
            };

            try {
                const newCharacter = await Character.add(character);
                await User.addCharacter(user, newCharacter.id, firebaseDoc.id);
                return await interaction.reply({ content: "New class added to your account", ephemeral: true });
            } catch (e) {
                console.log(e);
                return await interaction.reply({ content: "Something went adding a new character to your user account", ephemeral: true });
            }
        } catch (e) {
            return await interaction.reply({ content: "Something went wrong getting users", ephemeral: true });
        }
    },
};

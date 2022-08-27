import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { addDoc, collection, doc, DocumentData, DocumentReference, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../utils/client";
import { Raid } from "../model/Raid";
import { User } from "../model/User";
import { Character } from "../model/Character";

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
                ...Object.keys(Raid.engravings).map((className) => ({
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
            let isDuplicateCharacter = await Character.isDuplicate(characterData.value as string);
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
            const user = document.data();

            // handle checking if user exists
            const firebaseDoc = await User.exists(document, id);

            const classesRef = query(collection(db, "classes"), where("name", "==", classData.value));
            let characterClassId = null;

            // get the class id
            try {
                const classes = await getDocs(classesRef);

                classes.forEach((doc) => {
                    if (doc.data().name === classData.value) {
                        characterClassId = doc.id;
                    }
                });
            } catch (e) {
                return await interaction.reply({ content: "Something went wrong getting classes", ephemeral: true });
            }

            // create the character
            let character: {
                class: string;
                name: string;
                owner: string;
                ilvl: number;
                user: string;
            } = {
                class: characterClassId,
                owner: id, // discord id
                name: characterData.value as string,
                ilvl: Number.parseInt(ilevelData.value as string),
                user: firebaseDoc.id, // should be document id
            };

            try {
                const newCharacterId = await addDoc(collection(db, "characters"), character);
                user.characters.push(newCharacterId);
                await setDoc(doc(db, "users", firebaseDoc.id), user);
                return await interaction.reply({ content: "New class added to your account", ephemeral: true });
            } catch (e) {
                return await interaction.reply({ content: "Something went adding a new character to your user account", ephemeral: true });
            }
        } catch (e) {
            return await interaction.reply({ content: "Something went wrong getting users", ephemeral: true });
        }
    },
};

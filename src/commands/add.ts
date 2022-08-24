import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../utils/client";
import { Raid } from "../model/Raid";

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
        let isDuplicateCharacter = false;

        const charactersRef = query(collection(db, "characters"), where("name", "==", characterData.value));

        try {
            const characters = await getDocs(charactersRef);
            characters.forEach((character) => {
                if (character.data().name === characterData.value) {
                    isDuplicateCharacter = true;
                }
            });
        } catch (e) {
            return await interaction.reply({ content: "Something went wrong getting characters", ephemeral: true });
        }

        if (isDuplicateCharacter) {
            return await interaction.reply({ content: "This character's name exists already.", ephemeral: true });
        }

        const [classData, ilevelData] = rest;
        let user = null;
        let firebaseUser = null;
        const { id } = interaction.user;

        const usersRef = query(collection(db, "users"), where("discord_user", "==", id));
        const classesRef = query(collection(db, "classes"), where("name", "==", classData.value));

        try {
            const users = await getDocs(usersRef);
            users.forEach((doc) => {
                if (doc.data().discord_user === id) {
                    user = doc.data();
                    firebaseUser = doc;
                }
            });
            // get discord user's id
        } catch (e) {
            return await interaction.reply({ content: "Something went wrong getting users", ephemeral: true });
        }

        // if user doesn't exist
        if (!user) {
            //     // create user model and update var
            user = {
                discord_user: id,
                characters: [],
            };
            // make the user/add user to db
            firebaseUser = await addDoc(collection(db, "users"), user);
        }

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
        } = {
            class: characterClassId,
            owner: id,
            name: characterData.value as string,
            ilvl: Number.parseInt(ilevelData.value as string),
        };

        try {
            const newCharacterId = await addDoc(collection(db, "characters"), character);
            user.characters.push(newCharacterId);
            await setDoc(doc(db, "users", firebaseUser.id), user);
            return await interaction.reply({ content: "New class added to your account", ephemeral: true });
        } catch (e) {
            return await interaction.reply({ content: "Something went adding a new character to your user account", ephemeral: true });
        }
    },
};

import { collection, DocumentData, getDocs, QuerySnapshot } from "firebase/firestore";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Raid } from "../model/Raid";

export const command = {
    data: new SlashCommandBuilder()
        .setName("raids")
        .setDescription("Gets a list of all raids")
        .addStringOption((options) =>
            options
                .setName("date")
                .setDescription("Choose raids for a specific day")
                .addChoices(...Raid.menus["date"])
        ),
    async execute(interaction: CommandInteraction) {
        const date = interaction.options.data[0]?.value as string;
        try {
            await interaction.reply({ content: await Raid.showRaids(date), ephemeral: true });
        } catch (e) {
            await interaction.reply({ content: "Something went wrong retrieving raids" });
        }
    },
};

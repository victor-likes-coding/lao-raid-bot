import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Raid } from "../model/Raid";

export const command = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Pick and choose a raid based on your (optionally) chosen date")
        .addStringOption((options) =>
            options
                .setName("date")
                .setDescription("Choose what date to display")
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

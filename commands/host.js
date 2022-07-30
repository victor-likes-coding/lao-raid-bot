import { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } from "discord.js";
import { Raid } from "../src/model/Raid.js";

export const command = {
    data: new SlashCommandBuilder().setName("host").setDescription("Allows a user to host a raid"),
    async execute(interaction) {
        // create a Raid
        const raid = new Raid(interaction.user.tag);

        try {
            // Get Raid Type
            await interaction.reply({
                content: "Thanks for hosting a raid, please select a raid below:",
                ephemeral: true,
                components: [raid.selectMenus["raid"]],
            });
        } catch (e) {
            await interaction.reply({ content: "Something went wrong", ephemeral: true });
        }
    },
};

import { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } from "discord.js";
import { Raid } from "../src/model/Raid.js";

export const command = {
    data: new SlashCommandBuilder().setName("host").setDescription("Allows a user to host a raid"),
    async execute(interaction) {
        // create a Raid
        const raid = new Raid(interaction.user.tag);

        // create select menu
        const menu = new ActionRowBuilder().addComponents(
            new SelectMenuBuilder().setCustomId("raid").setPlaceholder("Select Raid").addOptions(raid.menus["raid"])
        );

        try {
            // Get Raid Type
            await interaction.reply({ content: "Thanks for hosting a raid, please select a raid below:", ephemeral: true, components: [menu] });
        } catch (e) {
            await interaction.reply({ content: "Something went wrong", ephemeral: true });
        }
    },
};

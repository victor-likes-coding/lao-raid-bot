import { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } from "discord.js";
import { Raid } from "../src/model/Raid.js";

export const command = {
    data: new SlashCommandBuilder().setName("host").setDescription("Allows a user to host a raid"),
    async execute(interaction) {
        // create a Raid
        Raid.addUpdater(interaction.user.tag).addUpdaterId(interaction.user.id);

        try {
            // Get Raid Type
            await interaction.reply({
                content: "Thanks for hosting a raid, please select a raid below:",
                components: [Raid.selectMenus["raid"]],
            });
        } catch (e) {
            await interaction.reply({ content: "Something went wrong" });
        }
    },
};

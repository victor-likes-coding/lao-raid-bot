import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Raid } from "../model/Raid";

export const command = {
    data: new SlashCommandBuilder().setName("host").setDescription("Allows a user to host a raid"),
    async execute(interaction: CommandInteraction) {
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

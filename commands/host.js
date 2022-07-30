import { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder().setName("host").setDescription("Allows a user to host a raid"),
    async execute(interaction) {
        // create a Raid
        const raid = {};

        // create select menu
        const menu = new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId("raid-type").setPlaceholder("Select Raid").addOptions());

        // Get Raid Type

        // Get Day of the week
        // Translate that to a date

        // Get Time of the day

        await interaction.reply({
            content: `Server: ${interaction.guild.name}\nMembers: ${interaction.guild.memberCount}\nMore information coming...`,
            ephemeral: true,
        });
    },
};

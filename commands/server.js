import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder().setName("server").setDescription("Provides information about the server, such as members, server level, etc."),
    async execute(interaction) {
        await interaction.reply({
            content: `Server: ${interaction.guild.name}\nMembers: ${interaction.guild.memberCount}\nMore information coming...`,
            ephemeral: true,
        });
    },
};

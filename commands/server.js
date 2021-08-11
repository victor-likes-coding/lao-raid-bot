import { SlashCommandBuilder } from "@discordjs/builders";

export const command = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription(
      "Provides information about the server, such as members, server level, etc."
    ),
  async execute(interaction) {
    const message = `Server: ${interaction.guild.name}\nMembers: ${interaction.guild.memberCount}\nMore information coming...`;
    return interaction.reply(message);
  },
};

import { SlashCommandBuilder } from "@discordjs/builders";
import { LucyEmbed } from "../src/model/Message/LucyEmbed.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription(
      "Provides information about the server, such as members, server level, etc."
    ),
  async execute(interaction) {
    const message = new LucyEmbed({
      title: "Server Command",
      description: `Server: ${interaction.guild.name}\nMembers: ${interaction.guild.memberCount}\nMore information coming...`,
    });
    return interaction.reply({ embeds: [message.content] });
  },
};

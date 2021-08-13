import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Message } from "../src/model/Message/Message.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Provides an up to date list of commands from Lucy"),
  async execute(interaction) {
    const message = new Message().addTitle("Lucy's Slash Command");
    const commands = interaction.client.commands;
    for (const [title, _] of commands) {
      const { description } = _.data.toJSON();
      message.addField({
        title,
        description,
        inline: false,
      });
    }
    await interaction.reply({ embeds: [message.content] });
  },
};

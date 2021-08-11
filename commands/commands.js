import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Provides an up to date list of commands from Lucy"),
  async execute(interaction) {
    const fancyMessageFormat = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Lucy's Slash Commands")
      .setTimestamp()
      .setFooter("\u00A9 Lucy Bot");
    console.log("User entered /commands");
    const commands = interaction.client.commands;
    for (const [commandName, _] of commands) {
      const { description } = _.data.toJSON();
      fancyMessageFormat.addField(commandName, description);
    }
    console.log(fancyMessageFormat);
    await interaction.reply({ embeds: [fancyMessageFormat] });
  },
};

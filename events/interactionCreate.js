import { ErrorMessage } from "../src/model/Message/ErrorMessage.js";

export const event = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    if (!interaction.client.commands.has(interaction.commandName)) return;

    try {
      return interaction.client.commands
        .get(interaction.commandName)
        .execute(interaction);
    } catch (error) {
      const message = new ErrorMessage({
        title: "Error",
        description: "There was an error while executing this command!",
      });
      await interaction.reply({
        embeds: [message.content],
        ephemeral: true,
      });
    }
  },
};

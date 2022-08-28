import { ChatInputCommandInteraction, CommandInteraction, SelectMenuInteraction } from "discord.js";
import { Character } from "../model/Character";

export const event = {
    name: "interactionCreate",
    async execute(interaction: any) {
        // check if chat inputs
        if (interaction.isSelectMenu()) {
            const selectMenuInteraction: SelectMenuInteraction = interaction;
            if (selectMenuInteraction.customId === "raid") {
                // we now know which raid id
                const [id] = selectMenuInteraction.values;

                // now we need to get a list of the characters they own
                const { id: userId } = selectMenuInteraction.user;
                await Character.getByOwnerId(userId);

        }

        if (interaction.isChatInputCommand()) {
            if (!interaction.client.commands.has(interaction.commandName)) return;

            try {
                return interaction.client.commands.get(interaction.commandName).execute(interaction);
            } catch (error) {
                await interaction.reply({
                    embeds: ["There was an issue with this command"],
                    ephemeral: true,
                });
            }
        }
    },
};

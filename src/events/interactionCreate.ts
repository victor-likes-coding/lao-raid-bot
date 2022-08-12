import { Raid, RaidType } from "../model/Raid";
import moment from "moment";

export const event = {
    name: "interactionCreate",
    async execute(interaction: any) {
        // check if chat inputs
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

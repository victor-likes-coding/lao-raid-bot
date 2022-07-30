import { raid } from "../src/model/Raid.js";

export const event = {
    name: "interactionCreate",
    async execute(interaction) {
        // check if command
        if (interaction.isCommand()) {
            if (!interaction.client.commands.has(interaction.commandName)) return;

            try {
                return interaction.client.commands.get(interaction.commandName).execute(interaction);
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
        }

        // check if selectmenu interaction
        if (interaction.isSelectMenu()) {
            await interaction.deferReply();
            if (interaction.customId === "raid") {
                await interaction.editReply({
                    content: `You've chosen: ${raid.menus["raid"][Number.parseInt(interaction.values[0])].label}, now choose a date`,
                    ephemeral: true,
                    components: [raid["selectMenus"]["date"]],
                });
            }

            if (interaction.customId === "date") {
                await interaction.editReply({
                    content: `You've chosen: ${raid.menus["date"][Number.parseInt(interaction.values[0])].label}, now choose a time`,
                    ephemeral: true,
                    components: [raid["selectMenus"]["time"]],
                });
            }
        }
    },
};

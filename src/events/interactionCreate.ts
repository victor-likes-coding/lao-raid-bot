import { Raid } from "../model/Raid";

export const event = {
    name: "interactionCreate",
    async execute(interaction: any) {
        // check if command
        if (interaction.isCommand()) {
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

        // check if selectmenu interaction
        if (interaction.isSelectMenu()) {
            await interaction.deferReply();
            if (interaction.customId === "raid" && interaction.user.id === Raid.getUpdaterId()) {
                Raid.addRaidDetails(interaction.user.id, "raid", Raid.menus["raid"][Number.parseInt(interaction.values[0])].label);
                await interaction.editReply({
                    content: `You've chosen: ${Raid.menus["raid"][Number.parseInt(interaction.values[0])].label}, now choose a date`,
                    ephemeral: true,
                    components: [Raid["selectMenus"]["date"]],
                });
            }

            if (interaction.customId === "date" && interaction.user.id === Raid.getUpdaterId()) {
                Raid.addRaidDetails(interaction.user.id, "date", Raid.menus["date"][Number.parseInt(interaction.values[0])].label);
                await interaction.editReply({
                    content: `You've chosen: ${Raid.menus["date"][Number.parseInt(interaction.values[0])].label}, now choose a time`,
                    ephemeral: true,
                    components: [Raid["selectMenus"]["time"]],
                });
            }

            if (interaction.customId === "time" && interaction.user.id === Raid.getUpdaterId()) {
                Raid.addRaidDetails(interaction.user.id, "time", Raid.menus["time"][Number.parseInt(interaction.values[0])].label);
                await interaction.editReply({
                    content: `You've chosen: ${
                        Raid.menus["time"][Number.parseInt(interaction.values[0])].label
                    }. Creating object data, will connect database later, this is still in development so nothing is permanent`,
                    ephemeral: true,
                    components: [],
                });
            }
        }
    },
};

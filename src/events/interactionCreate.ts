import { ChatInputCommandInteraction, CommandInteraction, InteractionCollector, MessageInteraction, SelectMenuInteraction } from "discord.js";
import { Raid, RaidType } from "../model/Raid";
import moment from "moment";

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
                Raid.addRaidDetails(interaction.user.id, "raid", Raid.menus["raid"][Number.parseInt(interaction.values[0])].value);
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
                const user = interaction.user.id;
                Raid.addRaidDetails(user, "time", Raid.menus["time"][Number.parseInt(interaction.values[0])].value);

                const { raid, date, time } = Raid.getLocalRaidDetails(user);

                const raidObject: RaidType = {
                    time:
                        new Date(moment().day(date).hour(time).startOf("hour").toString()).getTime() < Date.now()
                            ? new Date(moment().day(date).hour(time).startOf("hour").toString()).getTime() + 60 * 60 * 24 * 7 * 1000
                            : new Date(moment().day(date).hour(time).startOf("hour").toString()).getTime(),
                    type: raid,
                    characters: [],
                    active: true,
                };
                console.log(moment(raidObject.time).format("MM/DD dddd HH:mm"));

                try {
                    // add to the database
                    await Raid.add(raidObject);
                } catch (e) {
                    console.log("Using the add method didn't work");
                }

                await interaction.editReply({
                    content: `You've chosen: ${
                        Raid.menus["time"][Number.parseInt(interaction.values[0])].label
                    }. Raid created, please use /raids to see all raids, other features are being implemented so bear with me.`,
                    ephemeral: true,
                    components: [],
                });
            }
        }
    },
};

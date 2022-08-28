import { SlashCommandBuilder, CommandInteraction, SelectMenuBuilder, ActionRowBuilder, SelectMenuInteraction } from "discord.js";
import { Raid } from "../model/Raid";

export const command = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Pick and choose a raid based on your (optionally) chosen date")
        .addStringOption((options) =>
            options
                .setName("date")
                .setDescription("Choose what date to display")
                .addChoices(...Raid.menus["date"])
        ),
    async execute(interaction: CommandInteraction) {
        if (interaction.isCommand()) {
            const date = interaction.options.data[0]?.value as string;
            const raids = await Raid.getByDate(date);

            // make select menus
            const selectMenu = Raid.createSelectMenu(raids);
            console.log(selectMenu.components[0]);

            if (selectMenu.components[0].options.length > 0) {
                try {
                    await interaction.reply({
                        content: await Raid.showRaids(date),
                        ephemeral: true,
                        components: [selectMenu],
                    });
                } catch (e) {
                    await interaction.reply({ content: "Something went wrong retrieving raids" });
                }
            } else {
                try {
                    await interaction.reply({
                        content: await Raid.showRaids(date),
                        ephemeral: true,
                        components: [],
                    });
                } catch (e) {
                    await interaction.reply({ content: "Something went wrong retrieving raids" });
                }
            }
        }
    },
};

import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Raid } from "../model/Raid";

export const command = {
    data: new SlashCommandBuilder()
        .setName("host")
        .setDescription("Allows a user to host a raid")
        .addStringOption((option) =>
            option

                .addChoices(...Raid.menus["raid"])
                .setName("raid")
                .setDescription("Choose the raid type")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option

                .addChoices(...Raid.menus["date"])
                .setName("date")
                .setDescription("Choose the day of the raid")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option

                .addChoices(...Raid.menus["time"])
                .setName("time")
                .setDescription("Choose the time of the raid")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        // create a Raid
        try {
            // add this information into DB
            const newRaid = await Raid.add(Raid.createRaidObject(interaction.options.data));
            return await interaction.reply({ content: "Raid added, please use `/raids` to view a list of upcoming raids", ephemeral: true });
        } catch (e) {
            return await interaction.reply({ content: "Something went wrong adding a hosted raid", ephemeral: true });
        }
    },
};

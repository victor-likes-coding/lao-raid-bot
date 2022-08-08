import { collection, DocumentData, getDocs, QuerySnapshot } from "firebase/firestore";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Raid } from "../model/Raid";
import { db } from "../utils/client";
import moment from "moment";

export const command = {
    data: new SlashCommandBuilder().setName("raids").setDescription("Gets a list of all raids"),
    async execute(interaction: CommandInteraction) {
        try {
            // get raids
            const raids = await Raid.get("raids");
            let message = "";
            let index = 1;
            raids.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // Only grab docs where the time > now
                // check now and compare to doc.time and see if now > doc.time
                // only return raids where doc.time > now
                // turn doc into a Raid object

                const raidDoc = doc.data();
                if (raidDoc.time > Date.now()) {
                    const dateInfo = moment(raidDoc.time).format("MM/DD dddd @ HH:mm ZZ");
                    message += `\`\`\`${index++}. ${Raid.menus["raid"][Number.parseInt(raidDoc.type)].label}\nWhen: ${dateInfo}\nSpace: ${
                        raidDoc.characters.length
                    }\`\`\`\n`;
                }
            });

            await interaction.reply({ content: message, ephemeral: true });
        } catch (e) {
            await interaction.reply({ content: "Something went wrong retrieving raids" });
        }
    },
};

import fs from "fs";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { getDoc, doc } from "firebase/firestore";
import { sha256 } from "js-sha256";
import { fileExists } from "../utils/file";
import { config } from "../../config";
import { db } from "../utils/client";
import { ClassContent, Raid, RaidContent, RaidJSON } from "../model/Raid";

export const command = {
    data: new SlashCommandBuilder()
        .setName("new")
        .setDescription("Allows the owner (currently) or authorized users the ability to add raid types or class types")
        .addSubcommandGroup((group) =>
            group
                .setName("raid")
                .setDescription("Add a new raid")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("type")
                        .setDescription("Name the raid")
                        .addStringOption((option) => option.setRequired(true).setName("name").setDescription("Name the raid"))
                        .addIntegerOption((option) => option.setRequired(true).setName("ilevel").setDescription("Set item level of content"))
                        .addIntegerOption((option) => option.setRequired(true).setName("limit").setDescription("Sets the limit of members in raid"))
                )
        )
        .addSubcommandGroup((group) =>
            group
                .setName("class")
                .setDescription("Add a new class")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("type")
                        .setDescription("Name the class")
                        .addStringOption((option) => option.setRequired(true).setName("name").setDescription("Name the class"))
                        .addStringOption((option) =>
                            option.setRequired(true).setName("class-engraving-1").setDescription("Enter a class engraving of that class")
                        )
                        .addStringOption((option) =>
                            option.setRequired(true).setName("class-engraving-2").setDescription("Enter a class engraving of that class")
                        )
                        .addStringOption((option) => option.setRequired(true).setName("synergy").setDescription("Enter what this class brings to raids"))
                        .addIntegerOption((option) =>
                            option.setRequired(true).setName("type").setDescription("Enter what this class brings to raids").addChoices(
                                {
                                    name: "Support",
                                    value: 0,
                                },
                                {
                                    name: "DPS",
                                    value: 1,
                                }
                            )
                        )
                )
        ),
    async execute(interaction: CommandInteraction) {
        const { authorized } = config;
        const { id } = interaction.user;
        const hash = sha256(`${authorized}${id}`);

        const ownerRef = doc(db, "owner", id);
        const owner = await getDoc(ownerRef);

        if (owner.exists() && owner.data().hash === hash) {
            const { name } = interaction.options.data[0];

            if (name === "raid") {
                const [name, ilevel, limit] = interaction.options.data[0].options[0].options;
                // add this information into DB
                if (fileExists(Raid.pathToRaidFile)) {
                    // check if we have that raid by checking against the name
                    /* data structure:
                 * {
                  name: {
                    id,
                    ilevel,
                    memberLimit
                  }
                }
                 */
                    const parsedRaid = JSON.parse(fs.readFileSync(Raid.pathToRaidFile, "utf-8"));
                    const duplicated = Object.keys(parsedRaid).filter((key: string) => key.toLowerCase() === (name.value as string).toLowerCase()).length;
                    if (!duplicated) {
                        // means we should add to db and add to raid.json
                        const raidOptions: RaidContent = {
                            name: name.value as string,
                            ilevel: ilevel.value as number,
                            memberLimit: limit.value as number,
                        };

                        const raidDoc = await Raid.addRaidContent(raidOptions);
                        const data = (await getDoc(raidDoc)).data();
                        // when we get it back, we need to structure it like the above

                        parsedRaid[data.name] = {
                            id: raidDoc.id,
                            ilevel: data.ilevel,
                            memberLimit: data.memberLimit,
                        };
                        // Write to a local file and only write to it when new stuff gets added

                        fs.writeFileSync(Raid.pathToRaidFile, JSON.stringify(parsedRaid));

                        try {
                            return await interaction.reply({ content: "Raid type added!", ephemeral: true });
                        } catch (e) {
                            return await interaction.reply({ content: "Something went wrong for authorized user", ephemeral: true });
                        }
                    }

                    try {
                        return await interaction.reply({ content: "This raid has been added before", ephemeral: true });
                    } catch (e) {
                        return await interaction.reply({ content: "Something went wrong with replying that the raid has been added before", ephemeral: true });
                    }
                }
            }

            if (name === "class") {
                const [name, firstEngraving, secondEngraving, synergy, type] = interaction.options.data[0].options[0].options;

                const parsed = JSON.parse(fs.readFileSync(Raid.pathToClassFile, "utf-8"));
                const duplicated = Object.keys(parsed).filter((key: string) => key.toLowerCase() === (name.value as string).toLowerCase()).length;
                if (!duplicated) {
                    // means we should add to db and add to class.json
                    const classOptions: ClassContent = {
                        name: name.value as string,
                        firstEngraving: firstEngraving.value as string,
                        secondEngraving: secondEngraving.value as string,
                        synergy: synergy.value as string,
                        type: ["Support", "DPS"][type.value as number] as "Support" | "DPS",
                    };

                    const doc = await Raid.addClassContent(classOptions);
                    const data = (await getDoc(doc)).data();

                    parsed[data.name] = {
                        id: doc.id,
                        firstEngraving: data.firstEngraving,
                        secondEngraving: data.secondEngraving,
                        synergy: data.synergy,
                        type: data.type,
                    };
                    // Write to a local file and only write to it when new stuff gets added
                    console.log(data);
                    console.log(parsed[data.name]);

                    fs.writeFileSync(Raid.pathToClassFile, JSON.stringify(parsed));

                    try {
                        return await interaction.reply({ content: "Class type added!", ephemeral: true });
                    } catch (e) {
                        return await interaction.reply({ content: "Something went wrong for authorized user", ephemeral: true });
                    }
                }
                try {
                    return await interaction.reply({ content: "This class has been added before", ephemeral: true });
                } catch (e) {
                    return await interaction.reply({ content: "Something went wrong with replying that the raid has been added before", ephemeral: true });
                }
            }

            try {
                await interaction.reply({
                    content: "Unauthorized",
                    ephemeral: true,
                });
            } catch (e) {
                await interaction.reply({ content: "Something went wrong" });
            }
        }
    },
};

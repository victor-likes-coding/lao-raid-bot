import { ChatInputCommandInteraction, CommandInteraction, SelectMenuInteraction } from "discord.js";
import { Raid, RaidModel } from "../model/Raid";
import { Character, CharacterDataModel, CharacterModel } from "../model/Character";

export const event = {
    name: "interactionCreate",
    async execute(interaction: any) {
        // check if chat inputs
        if (interaction.isSelectMenu()) {
            const selectMenuInteraction: SelectMenuInteraction = interaction;
            const { id } = selectMenuInteraction.user; // discord user id

            if (selectMenuInteraction.customId === "raid") {
                // we now know which raid id
                const [raid] = selectMenuInteraction.values; // raid id

                // check and see if user selected this raid before
                const raidObject = (await Raid.getById(raid)) as RaidModel;
                if (Raid.userInRaid(raidObject.users, id)) {
                    // user has a character in the raid
                    return await interaction.update({
                        content: `You already have a character in this raid`,
                        ephemeral: true,
                        components: [],
                    });
                }

                // store the id for later use
                Raid.localSelectMenuSelections[id] = {
                    raid,
                };
                const characters = await Character.getByOwnerId(id);

                // create selectMenu based on characters
                const characterMenu = Character.createSelectMenu(characters);

                await selectMenuInteraction.update({ content: "Please select one of the following characters to join this raid", components: [characterMenu] });
            }

            if (selectMenuInteraction.customId === "character") {
                const [charId] = selectMenuInteraction.values; // character id
                const { raid: raidId } = Raid.localSelectMenuSelections[id];

                // check and see if the user is already in that raid
                const raid = (await Raid.getById(raidId)) as RaidModel;

                if (Raid.userInRaid(raid.users, id)) {
                    // user has a character in the raid
                    return await interaction.update({
                        content: `You already have a character in this raid`,
                        ephemeral: true,
                        components: [],
                    });
                }

                // now we have both character + raid ids

                // check if character is in a raid for the week
                const character = (await Character.getById(charId)) as CharacterDataModel;

                // check char level vs raid requirements
                if (character.ilvl < Raid.raidTypes[raid.type].ilevel) {
                    return await interaction.update({
                        content: `${character.name} does not meet the item level requirement of ${Raid.raidTypes[raid.type].ilevel}`,
                        ephemeral: true,
                        components: [],
                    });
                }

                if (character.raid) {
                    // character is tied into a raid

                    // check and see if the raid time is expired
                    if (Raid.isExpired(raid)) {
                        // if it is expired, the character can add this raid to it's data and the raid can add the character to it's character list
                        character.raid = raid.id;
                        raid.characters.push(character.id);
                        raid.users.push(id);

                        // update these documents
                        try {
                            await Character.update<CharacterDataModel>(character);
                            await Raid.update<RaidModel>(raid);
                            return await interaction.update({
                                content: `${character.name} has joined the ${raid.type} run.`,
                                ephemeral: true,
                                components: [],
                            });
                        } catch (e) {
                            return await interaction.update({
                                content: `There was an issue joining the raid with ${character.name}`,
                                ephemeral: true,
                                components: [],
                            });
                        }
                    } else {
                        return await interaction.update({
                            content: `${character.name} is currently signed up for another raid`,
                            ephemeral: true,
                            components: [],
                        });
                    }
                }

                character.raid = raid.id;
                raid.characters.push(character.id);
                raid.users.push(id);

                // update these documents
                try {
                    await Character.update<CharacterDataModel>(character);
                    await Raid.update<RaidModel>(raid);
                    return await interaction.update({
                        content: `${character.name} has joined the ${raid.type} run.`,
                        ephemeral: true,
                        components: [],
                    });
                } catch (e) {
                    return await interaction.update({
                        content: `There was an issue joining the raid with ${character.name}`,
                        ephemeral: true,
                        components: [],
                    });
                }
            }
        }
        if (interaction.isChatInputCommand()) {
            if (!interaction.client.commands.has(interaction.commandName)) return;

            try {
                return interaction.client.commands.get(interaction.commandName).execute(interaction, []);
            } catch (error) {
                await interaction.reply({
                    content: "There was an issue with this command",
                    ephemeral: true,
                });
            }
        }
    },
};

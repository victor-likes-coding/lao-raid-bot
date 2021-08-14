import { SlashCommandBuilder } from "@discordjs/builders";
import { ErrorMessage } from "../src/model/Message/ErrorMessage.js";
import { errors } from "../src/errors/codes.js";
import { Interaction } from "discord.js";
import { LucyEmbed } from "../src/model/Message/LucyEmbed.js";

const description = "Bans the user (not bots) from the server";

export const command = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription(description)
    .addUserOption((option) =>
      option.setName("user").setDescription(description).setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for banning user")
        .setRequired(true)
    ),
  async execute(interaction = new Interaction()) {
    // check user permissions
    const { id: userId } = interaction.member;
    const { user: target } = interaction.options.data[0];
    const { ownerId } = interaction.guild;

    const error = new ErrorMessage({
      title: "Ban Error",
    });

    try {
      // Error message may throw an error
      // member initiating ban must have permissions
      if (!interaction.member.permissions.has("BAN_MEMBERS")) {
        error.setErrorReason("bans", "NO_BAN_PERMS");
        return interaction.reply({ embeds: [error.content] });
      }

      // member cannot ban themself
      console.log(userId, ownerId);
      if (target.id === ownerId) {
        error.setErrorReason("bans", "NO_SELF_BAN");
        return interaction.reply({ embeds: [error.content] });
      }

      // member cannot ban bots
      if (target.bot) {
        error.setErrorReason("bans", "NO_BAN_BOTS");
        return interaction.reply({ embeds: [error.content] });
      }

      const targetCanBan =
        interaction.options.data[0].member.permissions.has("BAN_MEMBERS");
      // member cannot ban other members with ban permission
      if (targetCanBan) {
        // member is not owner -- cannot ban others with ban powers
        if (ownerId !== userId) {
          error.setErrorReason("bans", "NO_MOD_BANS");
          return interaction.reply({ embeds: [error.content] });
        }
      }

      const message = new LucyEmbed({
        title: "Ban Hammer Time",
        description: `Banning ${target.member.user.username}`,
        color: "#00ff00",
      });

      // target.member.ban();
      return interaction.reply({ embeds: message.content });
    } catch (error) {
      console.log(error.message);
      console.log(error);
      // const code = message.match(/\d{5}/);
    }
  },
};

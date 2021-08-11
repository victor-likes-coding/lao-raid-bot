import { SlashCommandBuilder } from "@discordjs/builders";

const description = "Bans the user (not bots) from the server";

export const command = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription(description)
    .addUserOption((option) =>
      option.setName("user").setDescription(description).setRequired(true)
    ),
  async execute(interaction) {
    // check user permissions
    if (!interaction.member.permissions.has("BAN_MEMBERS"))
      return interaction.reply(
        "You do not possess the capability to ban members, please reach out to the owner for access"
      );

    const { user: target } = interaction.options.data[0];
    // if they do have permission, check and see if the user is a bot -- only owner can remove bots
    if (target.bot) {
      // bans are for members not bots
      return interaction.reply(
        "The command you are attempting to use is intended towards human members and not bots"
      );
    }

    // members with ban powers cannot ban each other
    const targetCanBan =
      interaction.options.data[0].member.permissions.has("BAN_MEMBERS");
    if (targetCanBan) {
      // unless you're the owner
      const { ownerId } = interaction.guild;
      const { id: userId } = interaction.member;

      if (ownerId === userId) {
        // unless you're trying to ban yourself...?
        if (target.id === ownerId) {
          return interaction.reply(
            "You are attempting to ban yourself. Why? Aborting..."
          );
        }
        return interaction.reply("You're the boss, commencing ban");
      }

      return interaction.reply(
        "Can't ban members who can ban others, it's usurping power."
      );
    }
    console.log(interaction.options);
    return interaction.reply("Work in progress... Please try again");
  },
};

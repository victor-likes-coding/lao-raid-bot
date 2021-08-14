import config from "../config.js";

export const event = {
  name: "messageCreate",
  async execute(message) {
    const { prefix } = config;
    if (!message.content.startsWith(prefix) || message.member.user.bot) {
      return;
    }
    message.reply(
      "prefix commands are under construction, please use / commands"
    );
  },
};

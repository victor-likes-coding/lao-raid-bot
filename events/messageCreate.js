import config from "../config.js";

export const event = {
  name: "messageCreate",
  async execute(message) {
    const { prefix } = config;
    if (!message.content.startsWith(prefix) || message.user.bot) {
      return;
    }
    console.log(message);
  },
};

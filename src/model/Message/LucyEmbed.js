import { MessageEmbed } from "discord.js";

export class LucyEmbed {
  constructor(
    options = {
      color: "blue",
      timestamp: new Date(),
      footer: {
        text: "\u00A9 Lucybot 2021",
      },
    }
  ) {
    this.content = new MessageEmbed(options);
  }

  addTitle(title) {
    this.content.setTitle(title);
    return this;
  }

  addDescription(description) {
    this.content.setDescription(description);
    return this;
  }

  setColor(color) {
    this.content.setColor(color);
    return this;
  }

  addField(
    options = {
      title: "",
      description: "",
      inline: false,
    }
  ) {
    const { title, description, inline } = options;
    this.content.addField(title, description, inline);
  }
}

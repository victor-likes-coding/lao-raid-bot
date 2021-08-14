import { SlashCommandBuilder } from "@discordjs/builders";
import { ErrorMessage } from "../src/model/Message/ErrorMessage.js";
import { errors } from "../src/errors/codes.js";
import { Interaction } from "discord.js";
import { LucyEmbed } from "../src/model/Message/LucyEmbed.js";
import { Trade } from "../src/model/Trade/Trade.js";

const description =
  "BTO (Buy to Open) a trade object with details of the trade based on 1 contract";

export const command = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription(description)
    .addStringOption((option) =>
      option
        .setName("ticker")
        .setDescription("Ticker -- stock")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("strike")
        .setDescription("Strike Price cannot contain letters only numbers")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("price")
        .setDescription("Entry price cannot contain letters only numbers")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Option type - call (default) or puts")
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Expiration -- this Friday (default)")
    )
    .addStringOption((option) =>
      option.setName("amount").setDescription("Contract amount -- 1 (default)")
    ),
  async execute(interaction = new Interaction()) {
    const { data } = interaction.options;
    const tradeData = { owner: interaction.member.id };
    const error = new ErrorMessage();
    const message = new LucyEmbed({ color: "#00ff00" });

    for (let obj of data) {
      tradeData[obj.name] = obj.value;
    }
    try {
      const {
        info: { type, date, amount, average, strike, ticker, id },
      } = new Trade(tradeData);
      if (type === "P") {
        message.content.setColor("#ff0000");
      }
      message.content.setAuthor(id);
      message.addDescription(
        `BTO ${ticker} ${date} ${strike}${type} @ ${average}`
      );
      return interaction.reply({ embeds: [message.content] });
    } catch (err) {
      const [category, reason] = err.message.split("#");
      error.setErrorReason(category, reason);
    }
  },
};

import { SlashCommandBuilder } from "@discordjs/builders";
import { ErrorMessage } from "../src/model/Message/ErrorMessage.js";
import { errors } from "../src/errors/codes.js";
import { Interaction } from "discord.js";
import { LucyEmbed } from "../src/model/Message/LucyEmbed.js";
import { checkForOptionalValue } from "../utils/utils.js";
import { round } from "../utils/utils.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("trim")
    .setDescription("issues a take profit of `price`, calculates the percentage in profit as well from average price")
    .addStringOption((option) => option.setName("price").setDescription("Price sold contracts at"))
    .addIntegerOption((option) => option.setName("amount").setDescription("Amount of contracts sold, default is 1"))
    .addStringOption((option) => option.setName("sl").setDescription("A stop loss for members, optional")),
  async execute(interaction = new Interaction()) {
    // get the user id of member that issued tp command
    const optionalData = interaction.options?.data;
    const message = new LucyEmbed({ color: "#00a6d9" });

    // get the trade data and turn it into a Trade
    const amount = checkForOptionalValue(optionalData, "amount") < 4 ? 4 : checkForOptionalValue(optionalData, "amount");
    const price = checkForOptionalValue(optionalData, "price");

    const defaultMessage = `A good recommended trading strategy is to follow the 5%, 10%, 15%+ profit taking model (${
      amount ? "enter price arg to see targets" : ""
    })`;
    message.addTitle("Profit taking strategy");
    message.addDescription(defaultMessage);
    message.addField({
      title: "Take profit 1 / 25% trim",
      description: `5% ${price ? `-- Recommended based on input: ${round(Number.parseFloat(price) * 1.05)}\nRaise SL to entry of ${price}` : ""}`,
    });
    message.addField({
      title: "Take profit 2 / 50% trim",
      description: `10% ${
        price ? `-- Recommended based on input: ${round(Number.parseFloat(price) * 1.1)}\nRaise SL to TP 1: ${round(Number.parseFloat(price) * 1.05)}` : ""
      }`,
    });
    message.addField({
      title: "Take profit 3 / 25% trim",
      description: `15%+ ${price ? `-- Recommended based on input: ${round(Number.parseFloat(price) * 1.15)}+\nLet runners run until satisfied` : ""}`,
    });

    message.addField({
      title: `Trimming based on ${amount} (min of 4) stocks or contracts`,
      description: `TP 1: 25% (${Math.floor(amount * 0.25)})\nTP2: 50% (${Math.floor(amount * 0.5)})\nTP3: 25% (${
        amount - Math.floor(amount * 0.25) - Math.floor(amount * 0.5)
      })`,
    });

    return interaction.reply({ embeds: [message.content] });
  },
};

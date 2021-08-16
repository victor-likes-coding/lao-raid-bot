import { SlashCommandBuilder } from "@discordjs/builders";
import { ErrorMessage } from "../src/model/Message/ErrorMessage.js";
import { errors } from "../src/errors/codes.js";
import { Interaction } from "discord.js";
import { LucyEmbed } from "../src/model/Message/LucyEmbed.js";
import { Trade } from "../src/model/Trade/Trade.js";
import { db } from "../src/model/data/data.js";

const description = "BTO (Buy to Open) a trade object with details of the trade based on 1 contract";

export const command = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription(description)
    .addStringOption((option) => option.setName("ticker").setDescription("Ticker -- stock").setRequired(true))
    .addStringOption((option) => option.setName("strike").setDescription("Strike Price cannot contain letters only numbers").setRequired(true))
    .addStringOption((option) => option.setName("price").setDescription("Entry price cannot contain letters only numbers").setRequired(true))
    .addStringOption((option) => option.setName("type").setDescription("Option type - call (default) or puts"))
    .addStringOption((option) => option.setName("date").setDescription("Expiration -- this Friday (default)"))
    .addStringOption((option) => option.setName("amount").setDescription("Contract amount -- 1 (default)")),
  async execute(interaction = new Interaction()) {
    const { data: interactionData } = interaction.options;
    const tradeData = { owner: interaction.member.id };
    const error = new ErrorMessage();
    const message = new LucyEmbed({ color: "#00ff00" });
    const dashboard = new LucyEmbed({ color: "00a6d9" });

    // format data for use in Trade class
    for (let obj of interactionData) {
      tradeData[obj.name] = obj.value;
    }
    try {
      const trade = new Trade(tradeData);
      const {
        info: { type, date, average, strike, ticker, id, owner },
      } = trade;

      // if the trade type is a P(ut), change embed color to red, default is green for calls
      if (type === "P") {
        //
        message.content.setColor("#ff0000");
      }
      message.content.setAuthor(id);
      message.addDescription(`BTO ${ticker} ${date} ${strike}${type} @ ${average}`);

      // TODO: add trade to a list to be ref'd later (AKA `list` will be a db)
      db.add([trade.info]); // this will later be a database

      // TODO: display dashboard in some channel for now
      dashboard.content.setAuthor(`${interaction.member.user.username}'s current open trades`);
      const tradesByUser = db.getOpenOrdersByUserId(owner);

      tradesByUser.forEach((memberTrade, index) => {
        const currentTrade = new Trade(memberTrade);
        dashboard.addField({ title: `${index + 1}. ${currentTrade.toString()}`, description: currentTrade.toTotalProfitPercent() });
      });

      // TODO: display dashboard in respective channel if member is an analyst (should be the only message in the channel so that it can be replaced)
      await interaction.reply({
        embeds: [message.content, dashboard.content],
      });
    } catch (err) {
      const [category, reason] = err.message.split("#");
      console.error(err);
      error.setErrorReason(category, reason);
    }
  },
};

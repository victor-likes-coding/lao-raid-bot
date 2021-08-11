import { Client, Collection, Intents } from "discord.js";
class Lucy {
  client = new Client(options);
  constructor() {
    this.client.commands = new Collection();
  }

}


export const lucy = new Lucy();

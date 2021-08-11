import { Client, Collection, Intents } from "discord.js";
import { read } from "../utils/read.js";
const options = {
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
};

class Lucy {
  client = new Client(options);
  eventFiles = read("./events");
  commandFiles = read("./commands");
  constructor() {
    this.client.commands = new Collection();
  }

  get commands() {
    /**
     * Returns a simplified array of objects of the command list instead of the discordjs Collections data type.
     */
    return Array.from(this.client.commands.values()).map(({ data }) =>
      data.toJSON()
    );
  }

  async setEvents() {
    for (const file of this.eventFiles) {
      const { event } = await import(`../events/${file}`);
      if (event.once) {
        this.client.once(event.name, (...args) => event.execute(...args));
      } else {
        this.client.on(event.name, (...args) => event.execute(...args));
      }
    }
  }

  async setCommands() {
    for (const file of this.commandFiles) {
      const { command } = await import(`../commands/${file}`);
      // set a new item in the Collection
      // with the key as the command name and the value as the exported module
      this.client.commands.set(command.data.name, command);
    }
  }
          }

}

export const lucy = new Lucy();

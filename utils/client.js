import { Client, Collection, Intents } from "discord.js";
import { read } from "../utils/read.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "../config.js";

const options = {
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
};

class Lucy {
  client = new Client(options);
  eventFiles = read("./events");
  commandFiles = read("./commands");
  rest = new REST({ version: "9" }).setToken(config.token);

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

  async start() {
    await this.setCommands();
    await this.setEvents();
    await this.updateCommands(config.guild_id);
  }

  async updateCommands(guild_id) {
    (async () => {
      try {
        console.log("Started refreshing application (/) commands.");

        await this.rest.put(
          Routes.applicationGuildCommands(config.client_id, config.guild_id),
          {
            body: this.commands,
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    })();
  }
}

export const lucy = new Lucy();

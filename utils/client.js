import { Client, Collection, GatewayIntentBits, Routes } from "discord.js";
import { read } from "../utils/read.js";
import { REST } from "@discordjs/rest";
import { config } from "../config.js";
import { Raid } from "../src/model/Raid.js";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { config as firebaseConfig } from "../firebase.config.js";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

const options = {
    intents: [GatewayIntentBits.Guilds],
};

class Bot {
    client = new Client(options);
    eventFiles = read("./events");
    commandFiles = read("./commands");
    rest = new REST({ version: "10" }).setToken(config.token);

    constructor() {
        this.client.commands = new Collection();
    }

    get commands() {
        /**
         * Returns a simplified array of objects of the command list instead of the discordjs Collections data type.
         */
        return Array.from(this.client.commands.values()).map(({ data }) => data.toJSON());
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
        await this.updateCommands(config.guildId);
        Raid.setup();
    }

    async updateCommands(guild_id) {
        (async () => {
            try {
                console.log("Started refreshing application (/) commands.");

                await this.rest.put(Routes.applicationGuildCommands(config.clientId, guild_id), {
                    body: this.commands,
                    headers: { "Content-Type": "application/json" },
                });

                console.log("Successfully reloaded application (/) commands.");
            } catch (error) {
                console.error(error);
            }
        })();
    }
}

export const bot = new Bot();

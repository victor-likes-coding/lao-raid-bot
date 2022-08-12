import { Collection, GatewayIntentBits, Routes } from "discord.js";
import { SuperClient } from "../model/SuperClient";
import { read } from "./file";
import { REST } from "@discordjs/rest";
import { config } from "../../config";
import { Raid } from "../model/Raid";
import path from "path";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { config as firebaseConfig } from "../../firebase.config";

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
    client = new SuperClient(options);

    // Theory: use relative path of the start of the bot call which is in /index.ts
    eventFiles = read("./src/events");
    commandFiles = read("./src/commands");
    rest = new REST({ version: "10" }).setToken(config.token);

    constructor() {
        this.client.commands = new Collection();
    }

    get commands() {
        /**
         * Returns a simplified array of objects of the command list instead of the discordjs Collections data type.
         */
        return this.client.commands.map((val) => {
            return val.data;
        });
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
        await Raid.setup();
        await this.setCommands();
        await this.setEvents();
        await this.updateCommands(config.guildId);
    }

    async updateCommands(guild_id: string) {
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

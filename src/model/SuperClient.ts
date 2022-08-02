import { Client, ClientOptions, Collection } from "discord.js";

export class SuperClient extends Client {
    public commands: Collection<string, any>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
}

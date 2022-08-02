import { config } from "../config";
import { bot } from "../src/utils/client";

bot.start();

bot.client.login(config.token);

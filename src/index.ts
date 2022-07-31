import { config } from "../config";
import { bot } from "../utils/client";

bot.start();

bot.client.login(config.token);

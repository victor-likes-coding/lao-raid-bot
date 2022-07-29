import config from "../config.js";
import { bot } from "../utils/client.js";

bot.start();

bot.client.login(config.token);

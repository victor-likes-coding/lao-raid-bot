import config from "../config.js";
import { lucy } from "../utils/client.js";

lucy.start();

lucy.client.login(config.token);

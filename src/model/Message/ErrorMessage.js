import { LucyEmbed } from "./LucyEmbed.js";

export class ErrorMessage extends LucyEmbed {
  constructor(options = {}, reason = "", category = "") {
    super(options);
    this.content.setColor("red");
  }
}

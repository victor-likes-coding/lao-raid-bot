import { LucyEmbed } from "./LucyEmbed.js";

export class ErrorMessage extends LucyEmbed {
    super(options);
    this.content.setColor("red");
  }
}

import { LucyEmbed } from "./LucyEmbed.js";

export class ErrorMessage extends LucyEmbed {
  constructor(options = {}, reason = "", category = "") {
    super(options);
    this.content.setColor("#ff0000");
    this.reason = reason;
    this.category = category;
  setErrorReason(category, reason) {
    this.reason = reason;
    this.category = category;
  }
}

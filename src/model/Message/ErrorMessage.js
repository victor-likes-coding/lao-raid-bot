import { LucyEmbed } from "./LucyEmbed.js";
import { errors } from "../../errors/codes.js";

export class ErrorMessage extends LucyEmbed {
  constructor(options = {}, reason = "", category = "") {
    super(options);
    this.content.setColor("#ff0000");
    this.reason = reason;
    this.category = category;
    if (this.reason && this.category) {
      this.__setError();
    }
  }

  setErrorReason(category = "", reason = "") {
    this.reason = reason;
    this.category = category;
    this.__setError();
  }

  __setError() {
    const errorText = this.__setErrorString();
    this.addDescription(errorText);
  }

  __setErrorString() {
    const { text, code } = this.getErrorReason();
    return `${this.category.toUpperCase()}_ERROR ${code}: ${text}`;
  }

  getErrorReason() {
    if (this.category && this.reason) {
      const error = errors[this.category][this.reason];
      return error;
    }
    this.reason = "MISS_REQ_PARAMS";
    this.category = "internal";
    const error = this.__setErrorString();
    throw Error(error);
  }
}

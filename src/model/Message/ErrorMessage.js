import { Message } from "./Message.js";

export class ErrorMessage extends Message {
  constructor(options = {}) {
    super(options);
    this.content.setColor("red");
  }
}

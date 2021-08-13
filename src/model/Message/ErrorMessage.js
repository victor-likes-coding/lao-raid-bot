import { Message } from "./Message.js";

export class ErrorMessage extends Message {
  constructor(options = {}) {
    this.content.setColor("red");
  }
}

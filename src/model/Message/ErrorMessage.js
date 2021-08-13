import { Message } from "./Message.js";

export class ErrorMessage extends Message {
  constructor() {
    super();
    this.content.setColor("red");
  }
}

import moment from "moment";
import { errors } from "../../errors/codes.js";

import { v4 } from "uuid";

export class Trade {
  constructor({
    date = moment().day("friday").format("MM/DD"),
    ticker,
    strike,
    type = "c",
    price,
    amount = 1,
    owner,
  }) {
    try {
      this.__ticker = `$${ticker.toUpperCase()}`;
      this.__strike = Number.parseFloat(strike);
      this.__cost = Number.parseFloat(price) * Number.parseInt(amount);
      this.__amount = Number.parseInt(amount);
      this.__average = Number.parseFloat(price);
    } catch (err) {
      throw Error("internal#NAN");
    }
    this.__id = v4();
    this.__date = date;
    this.__type = type.toUpperCase();
    this.__owner = owner;
  }

  average(price, amount) {
    this.__cost += price * amount;
    this.__amount += amount;
    this.__average = this.round(this.cost / this.amount);
  }

  round(value) {
    // rounds to the nearest cent
    value = Math.round(value * 100) / 100;
    return value;
  }

  format(value) {
    return `${value < 1 ? `0${value}` : `${value}`}`;
  }

  get info() {
    const data = {
      id: this.__id,
      ticker: this.__ticker,
      date: this.__date,
      strike: this.__strike,
      type: this.__type,
      amount: this.__amount,
      average: this.format(this.__average),
      owner: this.__owner,
    };

    return data;
  }
}

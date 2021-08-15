import moment from "moment";
import { errors } from "../../errors/codes.js";
import { round, toPercent, format } from "../../../utils/utils.js";

import { v4 } from "uuid";

export class Trade {
  constructor({
    date = moment().day(12).format("MM/DD"),
    ticker,
    strike,
    type = "c",
    price = 0,
    amount = 1,
    owner,
    average = 0,
    profit = 0,
    status = true,
    cost = 0,
    profitPercent = 0,
  }) {
    try {
      this.__ticker = `${ticker.toUpperCase()}`;
      this.__strike = Number.parseFloat(strike);
      this.__amount = Number.parseInt(amount);
      this.__average = Number.parseFloat(price) || Number.parseFloat(average);
    } catch (err) {
      throw Error("internal#NAN");
    }
    this.__id = v4();
    this.__date = date;
    this.__type = type.toUpperCase();
    this.__owner = owner;
    this.__sl = undefined;
    this.__profit = profit;
    this.__status = status; // > 0 means open
    this.__cost = cost || this.__average * this.__amount;
    this.__tp = undefined;
    this.__trim = "";
    this.__profitPercent = profitPercent;
  }

  get amount() {
    return this.__amount;
  }

  set amount(amount) {
    this.__amount = amount;
  }

  get average() {
    return this.__average;
  }

  set average(price) {
    this.__average = price;
  }

  get id() {
    return this.__id;
  }

  set id(id) {
    this.__id = id;
  }

  get date() {
    return this.__date;
  }

  set date(date) {
    this.__date = date;
  }

  get type() {
    return this.__type;
  }

  set type(type) {
    this.__type = type;
  }

  get owner() {
    return this.__owner;
  }

  set owner(owner) {
    this.__owner = owner;
  }

  get sl() {
    return this.__sl;
  }

  set sl(sl) {
    this.__sl = sl;
  }

  get profit() {
    return this.__profit;
  }

  set profit(profit) {
    this.__profit = profit;
  }

  get status() {
    return this.__status;
  }

  set status(status) {
    this.__status = status;
  }

  get cost() {
    return this.__cost;
  }

  set cost(cost) {
    this.__cost = cost;
  }

  get tp() {
    return this.__tp;
  }

  set tp(tp) {
    this.__tp = tp;
  }

  get trim() {
    return this.__trim;
  }

  set trim(trim) {
    this.__trim = trim;
  }

  get info() {
    const data = {
      id: this.__id,
      ticker: this.__ticker,
      date: this.__date,
      strike: this.__strike,
      type: this.__type,
      amount: this.__amount,
      average: format(this.__average),
      owner: this.__owner,
      sl: this.__sl,
      profit: this.__profit,
      status: this.__status,
      cost: this.__cost,
      profitPercent: this.__profitPercent,
    };

    return data;
  }

  get profitPercent() {
    return this.__profitPercent;
  }

  set profitPercent(percent) {
    this.__profitPercent = percent;
  }

  toProfitPercentString() {
    return `Trim ${this.__trim} @ ${this.__tp} for ${toPercent((this.__tp - this.__average) / this.__average)}`;
  }

  toTotalProfitPercent() {
    return `Current Profit: ${this.__profitPercent}`;
  }

  toAverageString(price) {
    return `Average ${price > this.average ? "Up" : price < this.average ? "Down" : ""} @ ${format(Number.parseFloat(price))}, new average = ${this.average}`;
  }

  buy(price, amount = 1) {
    const newCost = price * amount;
    this.__cost += newCost;
    this.__amount += amount;
    this.__average = round(this.cost / this.amount);
  }

  toString() {
    return `${this.__status ? "OPEN" : "CLOSED"} $${this.__ticker} ${this.__date} ${this.__strike}${this.__type} @ ${format(this.__average)} ${
      this.__sl ? `\nStop: ${this.__sl}` : ""
    }`;
  }

  takeProfit(price, amount = 1) {
    this.__profit = round((price - this.__average) * amount);
    this.__trim = toPercent(amount / this.__amount, 0);
    this.__amount -= amount;
    this.__tp = price;
    this.__profitPercent = toPercent(this.__profit / this.__cost);
    if (!this.__amount) {
      this.__status = false; // means closed
    }
    this.__cost = this.__cost - amount * this.__average;
  }
}

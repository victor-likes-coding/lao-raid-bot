import moment from "moment";
import { Trade } from "./Trade.js";
describe("Trade", () => {
  const data = {
    price: 1,
    amount: 5,
    strike: 150,
    ticker: "aapl",
  };

  describe("Should have the following properties", () => {
    const trade = new Trade(data);
    it("should have cost as 5", () => {
      expect(trade.cost).toEqual(5);
    });
    it("should have date as the friday coming up", () => {
      expect(trade.date).toEqual("08/20");
    });
    it("should have type as C", () => {
      expect(trade.type).toEqual("C");
    });
    it("should have sl as undefined", () => {
      expect(trade.sl).toBeUndefined();
    });
    it("should have profit of 0", () => {
      expect(trade.profit).toEqual(0);
    });
    it("should have status of true", () => {
      expect(trade.status).toEqual(true);
    });
    it('should have trim of "" or falsy', () => {
      expect(trade.trim).toBeFalsy();
    });
    it("should have profitPercent of 0", () => {
      expect(trade.profitPercent).toEqual(0);
    });

    it("should have tp of undefined", () => {
      expect(trade.tp).toBeUndefined();
    });
  });

  describe("Should have the following props when taking profit", () => {
    const trade = new Trade(data);
    trade.takeProfit(1.2, 3);
    it("Should have profit at .60", () => {
      expect(trade.__profit).toEqual(0.6);
    });
    it("Should have cost still at 2", () => {
      expect(trade.cost).toEqual(2);
    });

    it("Should have trim at 60%", () => {
      expect(trade.trim).toEqual("60%");
    });

    it("Should have profitPercent of 20% of 60% or 12.00%", () => {
      expect(trade.profitPercent).toEqual("12.00%");
    });
  });

  describe("Should have the following props when averaging", () => {
    const trade = new Trade(data);
    trade.buy(0.5, 5);
    it("Should have cost of 5 + 2.5 => 7.5", () => {
      expect(trade.cost).toEqual(7.5);
    });

    it("Should have an average of .75", () => {
      expect(trade.average).toEqual(0.75);
    });

    it("Should have an amount of 10", () => {
      expect(trade.amount).toEqual(10);
    });
  });
});

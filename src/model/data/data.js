export const data = {};

export const getTradeById = (id) => {
  // return all trade information for id (should be the owner of the trade)
  return data;
};

export const getTradesByUserId = (id) => {
  return data[id];
};

class DB {
  trades = [];
  tradesByOwner = {};

  getTradeById(id) {
    return this.trades.filter((trade) => trade.id === id);
  }

  getTradesByUserId(id, index = undefined) {
    const trades = this.trades.filter((trade) => trade.owner === id);
    console.log(trades);
    return (index && index > 0 ? trades[index - 1] : trades) || [];
  }

  add(trades) {
    this.trades = [...this.trades, ...trades];
    this.setTradesByOwner();
  }

  updateById(ownerId, index, data) {
    const trade = { ...this.getOpenOrdersByUserId(ownerId)[index - 1], ...data };
    const trades = this.getTradesWithoutId(trade.id);
    this.trades = [...trades, trade];
    this.setTradesByOwner();
  }

  getTradesWithoutId(id) {
    return this.trades.filter((trade) => trade.id !== id) || [];
  }

  deleteById(id) {
    this.trades = this.gettradesWithoutId(id);
  }

  setTradesByOwner() {
    // fn goes and finds all unique owners
    const traders = this.trades.map((trade) => trade.owner);
    traders.forEach((ownerId) => {
      this.tradesByOwner[ownerId] = this.getOpenOrdersByUserId(ownerId);
    });
  }

  getOpenOrdersByUserId(id) {
    return this.getTradesByUserId(id).filter((trade) => trade.status) || [];
  }
}

export const db = new DB();

export const data = {};

export const getTrades = (id) => {
  // return all trade information for id (should be the owner of the trade)
  return data[id];
};

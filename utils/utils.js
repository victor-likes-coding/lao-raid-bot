export const round = (value) => {
  // rounds to the nearest cent
  value = Math.round(value * 100) / 100;
  return value;
};

export const format = (value = 0, precision = 2) => {
  return `${value.toFixed(precision)}`;
};

export const toPercent = (value, precision = 2) => {
  // value should be 0.XX where value are the XX
  return `${format(value * 100, precision)}%`;
};

export const checkForOptionalValue = (optionalData = {}, name) => {
  if (optionalData.hasOwnProperty("length") && optionalData.length) {
    const matching = optionalData.filter((data) => {
      return data.name === name;
    });
    return matching[0]?.value || undefined;
  }

  return optionalData?.value || undefined;
};

export const defaultIndicatorSettings = {
  sma: {
    length: 14,
    color: "#4ade80",
    width: 2,
  },

  ema: {
    length: 14,
    color: "#60a5fa",
    width: 2,
  },

  rsi: {
    length: 14,
    overbought: 70,
    oversold: 30,
    color: "#fbbf24",
  },

  macd: {
    fast: 12,
    slow: 26,
    signal: 9,
    color: "#f472b6",
  },

  vwap: {
    color: "#a855f7",
    width: 2,
  },

  bb: {
    length: 20,
    mult: 2,
    color: "#f97316",
  },

  // ⭐ NEW
  volume: {
    colorUp: "#22c55e",
    colorDown: "#ef4444",
    scale: "volume",
  },
};

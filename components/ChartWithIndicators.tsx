"use client";

import PriceChart from "./PriceChart";

export default function ChartWithIndicators({
  symbol,
  timeframe,
}: {
  symbol: string;
  timeframe: string;
}) {
  return (
    <div className="bg-gray-900 p-4 rounded border border-gray-700">
      <h2 className="text-xl font-semibold mb-2">
        {symbol} — {timeframe} Chart
      </h2>

      <PriceChart
        symbol={symbol}
        timeframe={timeframe}
        indicators={{
          sma: true,
          ema: true,
          rsi: false,
          macd: false,
          bb: false,
        }}
      />
    </div>
  );
}

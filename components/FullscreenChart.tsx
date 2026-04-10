"use client";

import PriceChart from "./PriceChart";

export default function FullscreenChart({
  symbol,
  timeframe,
  children,
}: {
  symbol: string;
  timeframe: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black z-50 p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {symbol} — {timeframe} (Fullscreen)
        </h2>
      </div>

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

      {/* Render children passed from ChartContainer */}
      {children}
    </div>
  );
}

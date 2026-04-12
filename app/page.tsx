"use client";

import { useState } from "react";
import SymbolSearch from "@/components/SymbolSearch";
import PriceChart from "@/components/PriceChart";

export default function HomePage() {
  const [symbol, setSymbol] = useState("AAPL");

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Search Bar */}
        <div className="w-full">
          <SymbolSearch onSelect={(s) => setSymbol(s)} />
        </div>

        {/* Selected Symbol Header */}
        <div className="text-2xl font-semibold">
          {symbol}
        </div>

        {/* Chart */}
        <div className="w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden">
          <PriceChart
            symbol={symbol}
            timeframe="1D"
            indicators={{ sma: false, ema: false, rsi: false, macd: false }}
          />
        </div>

      </div>
    </div>
  );
}

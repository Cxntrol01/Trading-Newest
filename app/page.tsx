"use client";

import { useState } from "react";
import PriceChart from "@/components/PriceChart";
import SymbolSearch from "@/components/SymbolSearch";
import { defaultIndicatorSettings } from "@/lib/indicatorSettings";

type Indicators = {
  sma: boolean;
  ema: boolean;
  rsi: boolean;
  macd: boolean;
  vwap: boolean;
  bb: boolean;
};

export default function HomePage() {
  const [symbol, setSymbol] = useState("AAPL");

  const [indicators, setIndicators] = useState<Indicators>({
    sma: false,
    ema: false,
    rsi: false,
    macd: false,
    vwap: false,
    bb: false,
  });

  // NEW: indicator settings state
  const [indicatorSettings, setIndicatorSettings] = useState(
    defaultIndicatorSettings
  );

  const toggleIndicator = (key: keyof Indicators) => {
    setIndicators((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Symbol Search */}
      <div className="max-w-sm">
        <SymbolSearch onSelect={(s) => setSymbol(s)} />
      </div>

      {/* Simple indicator toggles (homepage only) */}
      <div className="flex gap-4 text-white">
        {Object.keys(indicators).map((key) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={indicators[key as keyof Indicators]}
              onChange={() => toggleIndicator(key as keyof Indicators)}
            />
            {key.toUpperCase()}
          </label>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden">
        <PriceChart
          symbol={symbol}
          timeframe="1D"
          indicators={indicators}
          indicatorSettings={indicatorSettings}   // ⭐ REQUIRED FIX
        />
      </div>
    </div>
  );
}

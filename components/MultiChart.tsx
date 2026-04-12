"use client";

import { useState } from "react";
import PriceChart from "./PriceChart";
import SymbolSearch from "./SymbolSearch";

type ChartConfig = {
  symbol: string;
  timeframe: string;
};

export default function MultiChart() {
  const [layout, setLayout] = useState(1);

  // Each chart has its own symbol + timeframe
  const [charts, setCharts] = useState<ChartConfig[]>([
    { symbol: "AAPL", timeframe: "1D" },
  ]);

  // When layout changes, adjust chart count
  const updateLayout = (count: number) => {
    setLayout(count);

    setCharts((prev) => {
      const updated = [...prev];

      // Add charts if needed
      while (updated.length < count) {
        updated.push({ symbol: "AAPL", timeframe: "1D" });
      }

      // Trim charts if needed
      return updated.slice(0, count);
    });
  };

  // Update a single chart's symbol
  const updateSymbol = (index: number, symbol: string) => {
    setCharts((prev) => {
      const updated = [...prev];
      updated[index].symbol = symbol;
      return updated;
    });
  };

  // Update a single chart's timeframe
  const updateTimeframe = (index: number, timeframe: string) => {
    setCharts((prev) => {
      const updated = [...prev];
      updated[index].timeframe = timeframe;
      return updated;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Layout buttons */}
      <div className="flex items-center gap-3">
        {[1, 2, 4].map((n) => (
          <button
            key={n}
            onClick={() => updateLayout(n)}
            className={`px-3 py-1.5 rounded border ${
              layout === n
                ? "bg-blue-600 border-blue-500"
                : "bg-gray-800 border-gray-700 hover:bg-gray-700"
            }`}
          >
            {n} Chart{n > 1 ? "s" : ""}
          </button>
        ))}
      </div>

      {/* Chart Grid */}
      <div
        className={`grid gap-6 ${
          layout === 1 ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {charts.map((chart, i) => (
          <div
            key={i}
            className="border border-gray-800 rounded-lg bg-gray-900/40 h-[450px] overflow-hidden flex flex-col"
          >
            {/* Per-chart controls */}
            <div className="p-2 border-b border-gray-800 bg-gray-900 flex items-center gap-3">
              <div className="flex-1">
                <SymbolSearch onSelect={(s) => updateSymbol(i, s)} />
              </div>

              <select
                value={chart.timeframe}
                onChange={(e) => updateTimeframe(i, e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
              >
                <option value="1D">1D</option>
                <option value="1H">1H</option>
                <option value="30m">30m</option>
                <option value="15m">15m</option>
                <option value="5m">5m</option>
              </select>
            </div>

            {/* Chart */}
            <div className="flex-1">
              <PriceChart symbol={chart.symbol} timeframe={chart.timeframe} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

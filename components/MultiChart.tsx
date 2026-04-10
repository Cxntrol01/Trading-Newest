"use client";

import { useState } from "react";
import PriceChart from "./PriceChart";
import SymbolSearch from "./SymbolSearch";

export default function MultiChart() {
  const [layout, setLayout] = useState<1 | 2 | 4>(2);

  const [charts, setCharts] = useState([
    { symbol: "BTCUSDT", timeframe: "1m" },
    { symbol: "AAPL", timeframe: "1m" },
    { symbol: "TSLA", timeframe: "1m" },
    { symbol: "ETHUSDT", timeframe: "1m" },
  ]);

  function updateChart(index: number, updates: any) {
    setCharts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  }

  return (
    <div className="bg-gray-900 p-4 rounded border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Multi‑Chart View</h2>

      {/* Layout selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setLayout(1)}
          className={`px-3 py-1 rounded ${layout === 1 ? "bg-blue-600" : "bg-gray-700"}`}
        >
          1 Chart
        </button>
        <button
          onClick={() => setLayout(2)}
          className={`px-3 py-1 rounded ${layout === 2 ? "bg-blue-600" : "bg-gray-700"}`}
        >
          2 Charts
        </button>
        <button
          onClick={() => setLayout(4)}
          className={`px-3 py-1 rounded ${layout === 4 ? "bg-blue-600" : "bg-gray-700"}`}
        >
          4 Charts
        </button>
      </div>

      {/* Chart grid */}
      <div
        className={
          layout === 1
            ? "grid grid-cols-1 gap-4"
            : layout === 2
            ? "grid grid-cols-2 gap-4"
            : "grid grid-cols-2 gap-4"
        }
      >
        {charts.slice(0, layout).map((chart, i) => (
          <div key={i} className="bg-gray-800 p-3 rounded border border-gray-700">
            {/* Controls */}
            <div className="flex justify-between items-center mb-2">
              <SymbolSearch
                onSelect={(symbol) => updateChart(i, { symbol })}
              />

              <select
                value={chart.timeframe}
                onChange={(e) =>
                  updateChart(i, { timeframe: e.target.value })
                }
                className="bg-gray-900 text-white px-2 py-1 rounded"
              >
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="1h">1h</option>
                <option value="4h">4h</option>
                <option value="1D">1D</option>
                <option value="1W">1W</option>
              </select>
            </div>

            {/* Chart */}
            <PriceChart symbol={chart.symbol} timeframe={chart.timeframe} />
          </div>
        ))}
      </div>
    </div>
  );
}

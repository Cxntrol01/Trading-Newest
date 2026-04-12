"use client";

import { useState } from "react";
import PriceChart from "@/components/PriceChart";
import SymbolSearch from "@/components/SymbolSearch";

export default function ChartGrid() {
  const [layout, setLayout] = useState(1);

  const [charts, setCharts] = useState([
    {
      symbol: "AAPL",
      timeframe: "1D",
      indicators: {
        sma: false,
        ema: false,
        rsi: false,
        macd: false,
        vwap: false,
        bb: false,
      },
    },
  ]);

  const updateLayout = (count: number) => {
    setLayout(count);

    setCharts((prev) => {
      const updated = [...prev];

      while (updated.length < count) {
        updated.push({
          symbol: "AAPL",
          timeframe: "1D",
          indicators: {
            sma: false,
            ema: false,
            rsi: false,
            macd: false,
            vwap: false,
            bb: false,
          },
        });
      }

      return updated.slice(0, count);
    });
  };

  const updateSymbol = (index: number, symbol: string) => {
    setCharts((prev) => {
      const updated = [...prev];
      updated[index].symbol = symbol;
      return updated;
    });
  };

  const updateTimeframe = (index: number, timeframe: string) => {
    setCharts((prev) => {
      const updated = [...prev];
      updated[index].timeframe = timeframe;
      return updated;
    });
  };

  const toggleIndicator = (index: number, key: string) => {
    setCharts((prev) => {
      const updated = [...prev];
      updated[index].indicators[key] = !updated[index].indicators[key];
      return updated;
    });
  };

  return (
    <div className="flex flex-col gap-4">
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

      <div
        className={`grid gap-6 ${
          layout === 1 ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {charts.map((chart, i) => (
          <div
            key={i}
            className="border border-gray-800 rounded-lg bg-gray-900/40 h-[500px] overflow-hidden flex flex-col"
          >
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

            <div className="flex-1">
              <PriceChart
                symbol={chart.symbol}
                timeframe={chart.timeframe}
                indicators={chart.indicators}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

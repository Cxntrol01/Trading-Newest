"use client";

import { useState } from "react";
import PriceChart from "./PriceChart";
import SymbolSearch from "./SymbolSearch";

type ChartConfig = {
  symbol: string;
  timeframe: string;
  indicators: {
    sma: boolean;
    ema: boolean;
    rsi: boolean;
    macd: boolean;
    vwap: boolean;
    bb: boolean;
  };
};

export default function MultiChart() {
  const [layout, setLayout] = useState(1);

  const [charts, setCharts] = useState<ChartConfig[]>([
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

  const toggleIndicator = (
    index: number,
    key: keyof ChartConfig["indicators"]
  ) => {
    setCharts((prev) => {
      const updated = [...prev];
      updated[index].indicators[key] = !updated[index].indicators[key];
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
            className="border border-gray-800 rounded-lg bg-gray-900/40 h-[500px] overflow-hidden flex flex-col"
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

            {/* Indicator Dropdown */}
            <div className="p-2 border-b border-gray-800 bg-gray-800 flex items-center text-sm relative">

              <details className="group">
                <summary className="cursor-pointer px-3 py-1.5 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 select-none">
                  Indicators ▼
                </summary>

                <div className="absolute mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg p-3 w-56 z-50 space-y-3">

                  {/* TREND */}
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Trend</div>

                    {[
                      { key: "sma", label: "SMA" },
                      { key: "ema", label: "EMA" },
                      { key: "vwap", label: "VWAP" },
                    ].map((ind) => (
                      <label
                        key={ind.key}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            chart.indicators[
                              ind.key as keyof typeof chart.indicators
                            ]
                          }
                          onChange={() =>
                            toggleIndicator(i, ind.key as any)
                          }
                        />
                        {ind.label}
                      </label>
                    ))}
                  </div>

                  {/* OSCILLATORS */}
                  <div>
                    <div className="text-gray-400 text-xs mb-1">
                      Oscillators
                    </div>

                    {[
                      { key: "rsi", label: "RSI" },
                      { key: "macd", label: "MACD" },
                    ].map((ind) => (
                      <label
                        key={ind.key}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            chart.indicators[
                              ind.key as keyof typeof chart.indicators
                            ]
                          }
                          onChange={() =>
                            toggleIndicator(i, ind.key as any)
                          }
                        />
                        {ind.label}
                      </label>
                    ))}
                  </div>

                  {/* VOLATILITY */}
                  <div>
                    <div className="text-gray-400 text-xs mb-1">
                      Volatility
                    </div>

                    {[
                      { key: "bb", label: "Bollinger Bands" },
                    ].map((ind) => (
                      <label
                        key={ind.key}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            chart.indicators[
                              ind.key as keyof typeof chart.indicators
                            ]
                          }
                          onChange={() =>
                            toggleIndicator(i, ind.key as any)
                          }
                        />
                        {ind.label}
                      </label>
                    ))}
                  </div>

                </div>
              </details>

            </div>

            {/* Chart */}
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

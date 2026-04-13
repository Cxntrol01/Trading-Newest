"use client";

import { useState } from "react";
import PriceChart from "./PriceChart";
import OrderBook from "./OrderBook";

export default function ChartWorkspace() {
  const [symbol, setSymbol] = useState("AAPL");
  const [timeframe, setTimeframe] = useState("1D");

  const [indicators, setIndicators] = useState({
    sma: false,
    ema: false,
    rsi: false,
    macd: false,
    vwap: false,
    bb: false,
    volume: true,
    volumeMA: false,
  });

  const [indicatorSettings, setIndicatorSettings] = useState({
    sma: { length: 14, color: "#ffcc00", width: 2 },
    ema: { length: 14, color: "#00ccff", width: 2 },
    rsi: { length: 14, color: "#ff00ff" },
    macd: { fast: 12, slow: 26, signal: 9, color: "#00ff99" },
    vwap: { color: "#ffffff", width: 2 },
    bb: { length: 20, mult: 2, color: "#8888ff" },
    volume: { colorUp: "#22c55e", colorDown: "#ef4444" },
    volumeMA: { length: 20, color: "#ffaa00", width: 2 },
  });

  return (
    <div className="w-full h-full flex flex-col bg-black text-white">

      {/* ─────────────────────────────────────────────── */}
      {/* TOP BAR */}
      {/* ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black z-20">
        <div className="flex items-center gap-3">
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="bg-gray-900 border border-gray-700 px-3 py-1 rounded text-white w-24"
          />

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-gray-900 border border-gray-700 px-2 py-1 rounded text-white"
          >
            <option value="1D">1D</option>
            <option value="1H">1H</option>
            <option value="30m">30m</option>
            <option value="15m">15m</option>
            <option value="5m">5m</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() =>
              setIndicators({ ...indicators, sma: !indicators.sma })
            }
            className={`px-2 py-1 rounded ${
              indicators.sma ? "bg-blue-600" : "bg-gray-800"
            }`}
          >
            SMA
          </button>

          <button
            onClick={() =>
              setIndicators({ ...indicators, ema: !indicators.ema })
            }
            className={`px-2 py-1 rounded ${
              indicators.ema ? "bg-blue-600" : "bg-gray-800"
            }`}
          >
            EMA
          </button>

          <button
            onClick={() =>
              setIndicators({ ...indicators, rsi: !indicators.rsi })
            }
            className={`px-2 py-1 rounded ${
              indicators.rsi ? "bg-blue-600" : "bg-gray-800"
            }`}
          >
            RSI
          </button>

          <button
            onClick={() =>
              setIndicators({ ...indicators, macd: !indicators.macd })
            }
            className={`px-2 py-1 rounded ${
              indicators.macd ? "bg-blue-600" : "bg-gray-800"
            }`}
          >
            MACD
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────── */}
      {/* CHART AREA — FIXED HEIGHT, DROPDOWN SAFE */}
      {/* ─────────────────────────────────────────────── */}
      <div className="flex-1 min-h-[300px] relative overflow-hidden">
        <PriceChart
          symbol={symbol}
          timeframe={timeframe}
          indicators={indicators}
          indicatorSettings={indicatorSettings}
        />
      </div>

      {/* ─────────────────────────────────────────────── */}
      {/* ORDER BOOK — DOES NOT SHRINK CHART */}
      {/* ─────────────────────────────────────────────── */}
      <div className="h-[260px] overflow-y-auto border-t border-gray-800 shrink-0">
        <OrderBook symbol={symbol} />
      </div>
    </div>
  );
}

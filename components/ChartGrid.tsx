"use client";

import { useState, useRef } from "react";
import PriceChart from "@/components/PriceChart";
import SymbolSearch from "@/components/SymbolSearch";
import IndicatorSettingsPanel from "@/components/IndicatorSettingsPanel";
import IndicatorToggles from "@/components/IndicatorToggles";
import { defaultIndicatorSettings } from "@/lib/indicatorSettings";

type Indicators = {
  sma: boolean;
  ema: boolean;
  rsi: boolean;
  macd: boolean;
  vwap: boolean;
  bb: boolean;
  volume: boolean;
  volumeMA: boolean;
};

type ChartConfig = {
  symbol: string;
  timeframe: string;
  indicators: Indicators;
  indicatorSettings: any;
};

type IndicatorKey = keyof Indicators;

export default function ChartGrid() {
  const [layout, setLayout] = useState(1);

  const indicatorMenuRef = useRef<HTMLDetailsElement | null>(null); // ⭐ NEW

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
        volume: true,
        volumeMA: false,
      },
      indicatorSettings: JSON.parse(JSON.stringify(defaultIndicatorSettings)),
    },
  ]);

  const [openSettings, setOpenSettings] = useState<{
    chartIndex: number;
    indicator: IndicatorKey;
  } | null>(null);

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
            volume: true,
            volumeMA: false,
          },
          indicatorSettings: JSON.parse(
            JSON.stringify(defaultIndicatorSettings)
          ),
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

  const toggleIndicator = (index: number, key: IndicatorKey) => {
    setCharts((prev) => {
      const updated = [...prev];
      updated[index].indicators[key] = !updated[index].indicators[key];
      return updated;
    });
  };

  const updateIndicatorSettings = (
    chartIndex: number,
    indicator: IndicatorKey,
    newSettings: any
  ) => {
    setCharts((prev) => {
      const updated = [...prev];
      updated[chartIndex].indicatorSettings[indicator] = newSettings;
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
            className="border border-gray-800 rounded-lg bg-gray-900/40 h-[500px] overflow-hidden flex flex-col relative"
          >

            {openSettings && openSettings.chartIndex === i && (
              <IndicatorSettingsPanel
                indicator={openSettings.indicator}
                settings={
                  charts[i].indicatorSettings[openSettings.indicator]
                }
                onChange={(newSettings) =>
                  updateIndicatorSettings(
                    i,
                    openSettings.indicator,
                    newSettings
                  )
                }
                onClose={() => setOpenSettings(null)}
              />
            )}

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

            <div className="p-2 border-b border-gray-800 bg-gray-800 text-sm relative">

              <details ref={indicatorMenuRef} className="group">
                <summary className="cursor-pointer px-3 py-1.5 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 select-none">
                  Indicators ▼
                </summary>

                <div className="absolute mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg p-3 w-64 z-50">
                  <IndicatorToggles
                    indicators={chart.indicators}
                    onToggle={(key) => toggleIndicator(i, key)}
                    onOpenSettings={(key) => {
                      indicatorMenuRef.current?.removeAttribute("open"); // ⭐ FIX
                      setOpenSettings({
                        chartIndex: i,
                        indicator: key,
                      });
                    }}
                  />
                </div>
              </details>

            </div>

            <div className="flex-1">
              <PriceChart
                symbol={chart.symbol}
                timeframe={chart.timeframe}
                indicators={chart.indicators}
                indicatorSettings={chart.indicatorSettings}
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

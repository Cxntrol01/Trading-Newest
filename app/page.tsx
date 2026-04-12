"use client";

import { useState } from "react";
import PriceChart from "@/components/PriceChart";
import SymbolSearch from "@/components/SymbolSearch";
import IndicatorToggles from "@/components/IndicatorToggles";
import IndicatorSettingsPanel from "@/components/IndicatorSettingsPanel";
import { defaultIndicatorSettings } from "@/lib/indicatorSettings";

type Indicators = {
  sma: boolean;
  ema: boolean;
  rsi: boolean;
  macd: boolean;
  vwap: boolean;
  bb: boolean;
  volume: boolean;
  volumeMA: boolean; // ⭐ NEW
};

type IndicatorKey = keyof Indicators;

export default function HomePage() {
  const [symbol, setSymbol] = useState("AAPL");

  const [indicators, setIndicators] = useState<Indicators>({
    sma: false,
    ema: false,
    rsi: false,
    macd: false,
    vwap: false,
    bb: false,
    volume: true,
    volumeMA: false, // ⭐ NEW
  });

  const [indicatorSettings, setIndicatorSettings] = useState(
    defaultIndicatorSettings
  );

  // ⭐ FIX: openSettings must be an object, not a string
  const [openSettings, setOpenSettings] = useState<{
    indicator: IndicatorKey;
  } | null>(null);

  const toggleIndicator = (key: IndicatorKey) => {
    setIndicators((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateIndicatorSettings = (
    indicator: IndicatorKey,
    newSettings: any
  ) => {
    setIndicatorSettings((prev) => ({
      ...prev,
      [indicator]: newSettings,
    }));
  };

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Top controls */}
      <div className="flex items-center gap-4">

        {/* Symbol search */}
        <div className="max-w-sm flex-1">
          <SymbolSearch onSelect={(s) => setSymbol(s)} />
        </div>

        {/* Indicators dropdown */}
        <div className="relative text-sm">
          <details className="group">
            <summary className="cursor-pointer px-3 py-1.5 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 select-none">
              Indicators ▼
            </summary>

            <div className="absolute mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg p-3 w-64 z-50">
              <IndicatorToggles
                indicators={indicators}
                onToggle={(key) => toggleIndicator(key)}
                onOpenSettings={(key) =>
                  setOpenSettings({ indicator: key }) // ⭐ FIXED
                }
              />
            </div>
          </details>
        </div>
      </div>

      {/* Indicator settings panel */}
      {openSettings && (
        <IndicatorSettingsPanel
          indicator={openSettings.indicator} // ⭐ FIXED
          settings={indicatorSettings[openSettings.indicator]} // ⭐ FIXED
          onChange={(newSettings) =>
            updateIndicatorSettings(openSettings.indicator, newSettings)
          }
          onClose={() => setOpenSettings(null)}
        />
      )}

      {/* Chart */}
      <div className="w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden relative">
        <PriceChart
          symbol={symbol}
          timeframe="1D"
          indicators={indicators}
          indicatorSettings={indicatorSettings}
        />
      </div>
    </div>
  );
}

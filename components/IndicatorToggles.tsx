"use client";

import React from "react";

type Indicators = {
  sma: boolean;
  ema: boolean;
  rsi: boolean;
  macd: boolean;
  vwap: boolean;
  bb: boolean;
};

type IndicatorKey = keyof Indicators;

export default function IndicatorToggles({
  indicators,
  onToggle,
  onOpenSettings,
}: {
  indicators: Indicators;
  onToggle: (key: IndicatorKey) => void;
  onOpenSettings: (key: IndicatorKey) => void;
}) {
  const groups = [
    {
      title: "Trend",
      items: [
        { key: "sma", label: "SMA" },
        { key: "ema", label: "EMA" },
        { key: "vwap", label: "VWAP" },
      ],
    },
    {
      title: "Oscillators",
      items: [
        { key: "rsi", label: "RSI" },
        { key: "macd", label: "MACD" },
      ],
    },
    {
      title: "Volatility",
      items: [{ key: "bb", label: "Bollinger Bands" }],
    },
  ];

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.title}>
          <div className="text-gray-400 text-xs mb-1">{group.title}</div>

          {group.items.map((ind) => (
            <div
              key={ind.key}
              className="flex items-center justify-between px-2 py-1 hover:bg-gray-800 rounded"
            >
              {/* Checkbox + Label */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={indicators[ind.key as IndicatorKey]}
                  onChange={() => onToggle(ind.key as IndicatorKey)}
                />
                {ind.label}
              </label>

              {/* Settings Button */}
              <button
                onClick={() => onOpenSettings(ind.key as IndicatorKey)}
                className="text-gray-400 hover:text-white"
              >
                ⚙️
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

"use client";

import React from "react";

export default function IndicatorToggles({
  indicators,
  onToggle,
  onOpenSettings,
}: {
  indicators: Record<string, boolean>;
  onToggle: (key: string) => void;
  onOpenSettings: (key: string) => void;
}) {
  const items = [
    { key: "sma", label: "SMA" },
    { key: "ema", label: "EMA" },
    { key: "rsi", label: "RSI" },
    { key: "macd", label: "MACD" },
    { key: "vwap", label: "VWAP" },
    { key: "bb", label: "BB" },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 w-full">
      <h2 className="text-white font-semibold mb-3">Indicators</h2>

      <div className="flex flex-col gap-2">
        {items.map((ind) => (
          <div
            key={ind.key}
            className="flex items-center justify-between bg-neutral-800 px-3 py-2 rounded"
          >
            <label className="flex items-center gap-2 text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={indicators[ind.key]}
                onChange={() => onToggle(ind.key)}
              />
              {ind.label}
            </label>

            <button
              onClick={() => onOpenSettings(ind.key)}
              className="text-gray-400 hover:text-white text-lg"
            >
              ⚙️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

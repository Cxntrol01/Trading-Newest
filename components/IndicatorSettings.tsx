"use client";

import { useState } from "react";

interface IndicatorSettingsProps {
  indicator: string;
  onSave: (settings: any) => void;
}

export default function IndicatorSettings({ indicator, onSave }: IndicatorSettingsProps) {
  const [settings, setSettings] = useState<any>({
    length: 14,
    period: 20,
    fast: 12,
    slow: 26,
    signal: 9
  });

  const handleChange = (key: string, value: number) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="p-3 bg-gray-900 rounded-lg space-y-3">
      <h3 className="text-sm font-semibold text-white">{indicator} Settings</h3>

      {/* RSI / EMA / SMA */}
      {(indicator === "RSI" || indicator === "EMA" || indicator === "SMA") && (
        <div className="space-y-2">
          <label className="text-xs text-gray-300">Length / Period</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={settings.length || settings.period}
            onChange={(e) =>
              handleChange(indicator === "RSI" ? "length" : "period", Number(e.target.value))
            }
          />
        </div>
      )}

      {/* MACD */}
      {indicator === "MACD" && (
        <div className="space-y-2">
          <label className="text-xs text-gray-300">Fast Length</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={settings.fast}
            onChange={(e) => handleChange("fast", Number(e.target.value))}
          />

          <label className="text-xs text-gray-300">Slow Length</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={settings.slow}
            onChange={(e) => handleChange("slow", Number(e.target.value))}
          />

          <label className="text-xs text-gray-300">Signal Length</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={settings.signal}
            onChange={(e) => handleChange("signal", Number(e.target.value))}
          />
        </div>
      )}

      <button
        onClick={handleSave}
        className="w-full py-2 bg-blue-600 rounded text-white text-sm"
      >
        Save
      </button>
    </div>
  );
}

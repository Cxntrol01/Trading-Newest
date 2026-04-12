"use client";
import React from "react";

export default function IndicatorSettingsPanel({
  indicator,
  settings,
  onChange,
}: {
  indicator: string;
  settings: any;
  onChange: (newSettings: any) => void;
}) {
  return (
    <div className="absolute top-10 right-0 bg-neutral-900 border border-neutral-700 rounded-lg p-4 w-60 z-50">
      <h3 className="text-white font-semibold mb-3 capitalize">
        {indicator} Settings
      </h3>

      {Object.keys(settings).map((key) => (
        <div key={key} className="mb-3">
          <label className="text-gray-300 text-sm">{key}</label>
          <input
            type={typeof settings[key] === "number" ? "number" : "text"}
            value={settings[key]}
            onChange={(e) =>
              onChange({
                ...settings,
                [key]:
                  typeof settings[key] === "number"
                    ? Number(e.target.value)
                    : e.target.value,
              })
            }
            className="w-full mt-1 bg-neutral-800 text-white p-2 rounded"
          />
        </div>
      ))}
    </div>
  );
}

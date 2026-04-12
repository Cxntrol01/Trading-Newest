"use client";

import React from "react";

export default function IndicatorSettingsPanel({
  indicator,
  settings,
  onChange,
  onClose,
}: {
  indicator: string;
  settings: any;
  onChange: (newSettings: any) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="
        absolute inset-0 
        flex items-center justify-center
        z-[9999]
        backdrop-blur-md bg-black/40
        animate-fadeIn
      "
    >
      <div
        className="
          bg-gray-900 border border-gray-700 rounded-lg p-4 w-72 shadow-xl
          animate-slideUp
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold capitalize">
            {indicator} Settings
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Inputs */}
        <div className="space-y-3">
          {Object.keys(settings).map((key) => {
            const value = settings[key];
            const isNumber = typeof value === "number";

            return (
              <div key={key} className="flex flex-col">
                <label className="text-gray-300 text-sm capitalize mb-1">
                  {key}
                </label>

                <input
                  type={isNumber ? "number" : "text"}
                  value={value}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      [key]: isNumber
                        ? Number(e.target.value)
                        : e.target.value,
                    })
                  }
                  className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

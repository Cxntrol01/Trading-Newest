"use client";

import { useState } from "react";

interface AIRefreshRateProps {
  onSave?: (value: number) => void;
}

export default function AIRefreshRate({ onSave }: AIRefreshRateProps) {
  const [rate, setRate] = useState(5);

  const handleSave = () => {
    if (onSave) onSave(rate);
  };

  return (
    <div className="p-3 bg-gray-900 rounded-lg space-y-3">
      <h3 className="text-sm font-semibold text-white">AI Refresh Rate</h3>

      <div className="space-y-2">
        <label className="text-xs text-gray-300">Seconds</label>
        <input
          type="number"
          min={1}
          max={60}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full bg-gray-800 text-white p-2 rounded"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full py-2 bg-blue-600 rounded text-white text-sm"
      >
        Save
      </button>
    </div>
  );
}

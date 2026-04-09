"use client";

import { useState } from "react";

interface RefreshIntervalProps {
  onSave?: (value: number) => void;
}

export default function RefreshInterval({ onSave }: RefreshIntervalProps) {
  const [interval, setInterval] = useState(5);

  const handleSave = () => {
    if (onSave) onSave(interval);
  };

  return (
    <div className="p-3 bg-gray-900 rounded-lg space-y-3">
      <h3 className="text-sm font-semibold text-white">Refresh Interval</h3>

      <div className="space-y-2">
        <label className="text-xs text-gray-300">Seconds</label>
        <input
          type="number"
          min={1}
          max={60}
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
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

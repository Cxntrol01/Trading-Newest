"use client";

import { useState } from "react";

export default function SymbolSearch({ onSelect }: { onSelect: (symbol: string) => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSelect(value.trim().toUpperCase());
  };

  return (
    <div className="flex gap-2 items-center p-2 bg-gray-900 rounded">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search symbol (AAPL, TSLA, MSFT...)"
        className="px-3 py-2 bg-gray-800 rounded text-white w-full"
      />

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 rounded text-white"
      >
        Load
      </button>
    </div>
  );
}

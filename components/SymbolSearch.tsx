"use client";

import { useState, useEffect } from "react";

export default function SymbolSearch({
  onSelect,
}: {
  onSelect: (symbol: string) => void;
}) {
  const [value, setValue] = useState("");
  const [symbols, setSymbols] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  // Load ALL stocks from your API route
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/stocks");
      const data = await res.json();
      setSymbols(data);
    }
    load();
  }, []);

  // Filter as user types
  useEffect(() => {
    if (!value) {
      setFiltered([]);
      return;
    }

    const q = value.toLowerCase();

    const results = symbols
      .filter((s) => s.symbol.toLowerCase().includes(q))
      .slice(0, 50); // limit for performance

    setFiltered(results);
  }, [value, symbols]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="Search symbol..."
          className="px-3 py-1 bg-gray-800 rounded text-white w-full"
        />

        <button
          className="px-3 py-1 bg-blue-600 rounded"
          onClick={() => {
            if (value.trim() !== "") onSelect(value.trim());
          }}
        >
          Load
        </button>
      </div>

      {/* Search results dropdown */}
      {filtered.length > 0 && (
        <div className="bg-gray-900 rounded max-h-60 overflow-y-auto border border-gray-700">
          {filtered.map((s) => (
            <div
              key={s.symbol}
              onClick={() => {
                onSelect(s.symbol);
                setValue(s.symbol);
                setFiltered([]);
              }}
              className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
            >
              {s.symbol} — {s.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

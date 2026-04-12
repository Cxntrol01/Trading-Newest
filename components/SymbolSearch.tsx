"use client";

import { useState } from "react";
import { STOCK_SYMBOLS } from "@/data/symbols";

export default function SymbolSearch({ onSelect }: { onSelect: (symbol: string) => void }) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<typeof STOCK_SYMBOLS>([]);

  const handleChange = (text: string) => {
    setValue(text);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    const q = text.toUpperCase();

    const filtered = STOCK_SYMBOLS.filter(
      (s) =>
        s.symbol.startsWith(q) ||
        s.name.toUpperCase().includes(q)
    ).slice(0, 8); // limit results

    setResults(filtered);
  };

  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    setValue(symbol);
    setResults([]);
  };

  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search stocks (AAPL, TSLA, MSFT...)"
        className="px-3 py-2 bg-gray-800 rounded text-white w-full"
      />

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded mt-1 z-50">
          {results.map((item) => (
            <div
              key={item.symbol}
              onClick={() => handleSelect(item.symbol)}
              className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-white"
            >
              <span className="font-bold">{item.symbol}</span>
              <span className="text-gray-400 ml-2">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

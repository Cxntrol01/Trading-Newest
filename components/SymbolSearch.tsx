"use client";

import { useState, useEffect } from "react";

export default function SymbolSearch({ onSelect }: { onSelect: (symbol: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();

      setResults(data.results);
      setLoading(false);
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        className="w-full p-2 border rounded bg-black text-white"
        placeholder="Search stocks…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <div className="absolute left-2 top-10 text-gray-400">Searching…</div>}

      {results.length > 0 && (
        <div className="absolute w-full bg-black border border-gray-700 rounded mt-1 max-h-64 overflow-y-auto z-50">
          {results.map((item) => (
            <div
              key={item.symbol}
              className="p-2 hover:bg-gray-800 cursor-pointer"
              onClick={() => {
                onSelect(item.symbol);
                setQuery("");
                setResults([]);
              }}
            >
              <div className="text-white">{item.symbol}</div>
              <div className="text-gray-400 text-sm">{item.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

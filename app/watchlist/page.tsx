// app/watchlist/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function WatchlistPage() {
  const { items, add, remove, loaded } = useWatchlist();
  const [input, setInput] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    add(input);
    setInput("");
  };

  return (
    <div className="p-6 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-white">Watchlist</h1>

      <form onSubmit={onSubmit} className="flex gap-3 max-w-md">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add ticker (e.g. AAPL)"
          className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
        >
          Add
        </button>
      </form>

      {!loaded ? (
        <p className="text-gray-500 text-sm">Loading watchlist…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No tickers yet. Add some above to build your watchlist.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
          {items.map((item) => (
            <div
              key={item.symbol}
              className="p-3 bg-gray-900/60 border border-gray-800 rounded-lg flex items-center justify-between"
            >
              <span className="font-semibold text-white">{item.symbol}</span>
              <button
                onClick={() => remove(item.symbol)}
                className="text-xs text-gray-400 hover:text-red-400 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

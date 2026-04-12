// hooks/useWatchlist.ts
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "watchlist";

export type WatchlistItem = {
  symbol: string;
};

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Failed to load watchlist", e);
    } finally {
      setLoaded(true);
    }
  }, []);

  const save = (next: WatchlistItem[]) => {
    setItems(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };

  const add = (symbol: string) => {
    const clean = symbol.trim().toUpperCase();
    if (!clean) return;
    if (items.some((i) => i.symbol === clean)) return;
    save([...items, { symbol: clean }]);
  };

  const remove = (symbol: string) => {
    const clean = symbol.trim().toUpperCase();
    save(items.filter((i) => i.symbol !== clean));
  };

  return { items, add, remove, loaded };
}

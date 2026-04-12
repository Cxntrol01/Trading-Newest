"use client";

import Link from "next/link";
import NewsFeed from "@/components/NewsFeed";
import { useWatchlist } from "@/hooks/useWatchlist";

export default function Home() {
  const { items, loaded } = useWatchlist();

  return (
    <div className="p-6 flex flex-col gap-16">

      {/* Hero Section */}
      <section className="text-center mt-10 relative">
        {/* Glow Behind Title */}
        <div className="absolute inset-0 flex justify-center -z-10">
          <div className="w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full"></div>
        </div>

        <h1 className="text-5xl font-bold text-white mb-3">
          Welcome Back, Finlay
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Analyse markets. Build strategies. Trade smarter.
        </p>

        <Link
          href="/workspace"
          className="
            inline-block mt-6 px-6 py-3 
            bg-blue-600 hover:bg-blue-500 
            rounded-lg text-white font-semibold
            transition-all duration-200
          "
        >
          Launch Workspace
        </Link>
      </section>

      {/* Animated Market Ticker */}
      <section className="overflow-hidden border border-gray-800 rounded-lg bg-gray-900/30 backdrop-blur-xl py-3 shadow-lg">
        <div className="whitespace-nowrap animate-ticker flex gap-10 px-4 text-sm">

          <div className="flex flex-col">
            <span className="font-semibold text-white">S&P 500</span>
            <span className="text-green-400">+0.82%</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-white">NASDAQ</span>
            <span className="text-green-400">+1.12%</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-white">FTSE 100</span>
            <span className="text-red-400">-0.34%</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-white">AAPL</span>
            <span className="text-green-400">+0.56%</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-white">NVDA</span>
            <span className="text-green-400">+2.14%</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-white">TSLA</span>
            <span className="text-red-400">-1.22%</span>
          </div>

        </div>
      </section>

      {/* Continue Where You Left Off */}
      <section className="border border-gray-800 rounded-lg p-6 bg-gray-900/40 backdrop-blur-md shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Continue where you left off</h2>
        <p className="text-gray-400 mb-4">
          Last opened: <span className="text-white">AAPL · 1D</span>
        </p>

        <Link
          href="/workspace"
          className="
            inline-block px-5 py-2 
            bg-gray-700 hover:bg-gray-600 
            rounded-lg text-white transition
          "
        >
          Resume Workspace
        </Link>
      </section>

      {/* Watchlist Preview (Dynamic) */}
      <section className="border border-gray-800 rounded-lg p-6 bg-gray-900/40 backdrop-blur-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Your Watchlist</h2>

        {!loaded ? (
          <p className="text-gray-500 text-sm">Loading watchlist…</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No tickers yet. Add them on the Watchlist page.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {items.map((item) => (
              <div
                key={item.symbol}
                className="p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="font-semibold">{item.symbol}</div>
                <div className="text-gray-400 text-xs">
                  % change coming soon…
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* LIVE Market-Moving News */}
      <NewsFeed />

    </div>
  );
}

"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 flex flex-col gap-12">

      {/* Hero Section */}
      <section className="text-center mt-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Welcome to Your Trading Workspace
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
      <section className="overflow-hidden border border-gray-800 rounded-lg bg-gray-900/40 backdrop-blur-sm py-3">
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

    </div>
  );
}

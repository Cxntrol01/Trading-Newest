"use client";

import ChartGrid from "@/components/ChartGrid";
import OrderBook from "@/components/OrderBook";

export default function WorkspacePage() {
  return (
    <div className="w-full h-screen flex flex-col bg-black text-white">

      {/* MULTICHART */}
      <div className="flex-1 min-h-[300px] overflow-hidden">
        <ChartGrid />
      </div>

      {/* ORDERBOOK BELOW MULTICHART */}
      <div className="h-[260px] overflow-y-auto border-t border-gray-800 shrink-0">
        <OrderBook symbol="AAPL" />
      </div>

    </div>
  );
}

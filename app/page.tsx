"use client";

import { useState } from "react";
import SymbolSearch from "@/components/SymbolSearch";
import PriceChart from "@/components/PriceChart";

export default function Home() {
  const [symbol, setSymbol] = useState("AAPL");

  return (
    <div className="p-4 flex flex-col gap-4 h-screen bg-black">
      <SymbolSearch onSelect={setSymbol} />

      <div className="flex-1">
        <PriceChart symbol={symbol} />
      </div>
    </div>
  );
}

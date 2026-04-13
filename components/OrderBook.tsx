"use client";

import { useEffect, useState } from "react";

type Level = {
  price: number;
  size: number;
};

export default function OrderBook({ symbol }: { symbol: string }) {
  const [bids, setBids] = useState<Level[]>([]);
  const [asks, setAsks] = useState<Level[]>([]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) return;

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    };

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data);

      if (json.type !== "depth") return;

      const data = json.data;

      if (data.b) {
        setBids(
          data.b
            .map((x: any) => ({ price: x[0], size: x[1] }))
            .sort((a: any, b: any) => b.price - a.price)
            .slice(0, 10)
        );
      }

      if (data.a) {
        setAsks(
          data.a
            .map((x: any) => ({ price: x[0], size: x[1] }))
            .sort((a: any, b: any) => a.price - b.price)
            .slice(0, 10)
        );
      }
    };

    return () => {
      try {
        ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
      } catch {}
      ws.close();
    };
  }, [symbol]);

  return (
    <div className="w-full bg-black border-t border-gray-800 p-3 text-gray-200">
      <h2 className="text-lg font-semibold mb-2">Order Book</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* BIDS */}
        <div>

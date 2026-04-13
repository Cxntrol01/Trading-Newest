/* app/api/live/route.ts */
import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "AAPL";
  const interval = searchParams.get("interval") || "1m";

  const pair = new WebSocketPair();
  const client = pair[0];
  const server = pair[1];

  server.accept();

  // Simple in‑memory price state (random walk demo)
  let lastPrice = 100 + Math.random() * 20;
  let lastVolume = 1_000_000;

  const sendTick = () => {
    const nowSec = Math.floor(Date.now() / 1000);

    const delta = (Math.random() - 0.5) * 0.6;
    const open = lastPrice;
    const close = Math.max(1, lastPrice + delta);
    const high = Math.max(open, close) + Math.random() * 0.3;
    const low = Math.min(open, close) - Math.random() * 0.3;
    const volume = Math.max(1, lastVolume + Math.floor((Math.random() - 0.5) * 50_000));

    lastPrice = close;
    lastVolume = volume;

    const tick = {
      symbol,
      interval,
      time: nowSec,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    };

    try {
      server.send(JSON.stringify(tick));
    } catch {
      clearInterval(intervalId);
      try {
        server.close();
      } catch {}
    }
  };

  const intervalId = setInterval(sendTick, 1000);

  server.addEventListener("close", () => {
    clearInterval(intervalId);
  });

  server.addEventListener("error", () => {
    clearInterval(intervalId);
    try {
      server.close();
    } catch {}
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  } as any);
}

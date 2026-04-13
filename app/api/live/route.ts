// app/api/live/route.ts
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "AAPL";
  const interval = searchParams.get("interval") || "1m";

  // Upgrade the request to a WebSocket
  const { socket, response } = Deno.upgradeWebSocket(req);

  // Synthetic price generator
  let lastPrice = 100 + Math.random() * 20;
  let lastVolume = 1_000_000;

  const sendTick = () => {
    const nowSec = Math.floor(Date.now() / 1000);

    const delta = (Math.random() - 0.5) * 0.6;
    const open = lastPrice;
    const close = Math.max(1, lastPrice + delta);
    const high = Math.max(open, close) + Math.random() * 0.3;
    const low = Math.min(open, close) - Math.random() * 0.3;
    const volume = Math.max(
      1,
      lastVolume + Math.floor((Math.random() - 0.5) * 50_000)
    );

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
      socket.send(JSON.stringify(tick));
    } catch {
      clearInterval(intervalId);
      try {
        socket.close();
      } catch {}
    }
  };

  const intervalId = setInterval(sendTick, 1000);

  socket.onclose = () => clearInterval(intervalId);
  socket.onerror = () => {
    clearInterval(intervalId);
    try {
      socket.close();
    } catch {}
  };

  return response;
}

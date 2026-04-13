// app/api/live/route.ts
import { NextRequest } from "next/server";
import WebSocket from "ws";

export const runtime = "nodejs"; // REQUIRED for WebSockets

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "AAPL";

  // Validate upgrade
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 400 });
  }

  // @ts-ignore - Next.js internal API
  const { socket, response } = (req as any).upgrade();

  // Connect to Finnhub WebSocket
  const finnhub = new WebSocket(
    `wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`
  );

  finnhub.on("open", () => {
    finnhub.send(
      JSON.stringify({
        type: "subscribe",
        symbol,
      })
    );
  });

  // Forward Finnhub trades → your chart
  finnhub.on("message", (msg) => {
    try {
      const json = JSON.parse(msg.toString());
      if (json.type !== "trade" || !json.data) return;

      const trade = json.data[0];

      const tick = {
        symbol,
        time: Math.floor(trade.t / 1000),
        open: trade.p,
        high: trade.p,
        low: trade.p,
        close: trade.p,
        volume: trade.v ?? 1,
      };

      socket.send(JSON.stringify(tick));
    } catch {}
  });

  // Cleanup
  socket.onclose = () => {
    try {
      finnhub.send(
        JSON.stringify({
          type: "unsubscribe",
          symbol,
        })
      );
      finnhub.close();
    } catch {}
  };

  finnhub.on("close", () => {
    try {
      socket.close();
    } catch {}
  });

  return response;
}

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "BTCUSDT";
  const interval = searchParams.get("interval") || "1h";

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=200`;

  const res = await fetch(url);
  const data = await res.json();

  const candles = data.map((c: any) => ({
    time: c[0] / 1000,
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
  }));

  return NextResponse.json(candles);
}

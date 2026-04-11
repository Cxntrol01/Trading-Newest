import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "AAPL";
  const interval = searchParams.get("interval") || "60";

  const key = process.env.NEXT_PUBLIC_FINNHUB_KEY;

  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${interval}&count=200&token=${key}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.s !== "ok") {
    return NextResponse.json([]);
  }

  const candles = data.t.map((t: number, i: number) => ({
    time: t,
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
  }));

  return NextResponse.json(candles);
}

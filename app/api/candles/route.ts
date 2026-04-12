import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "AAPL";
  const interval = searchParams.get("interval") || "1h"; // 1m, 5m, 15m, 1h, 1d
  const range = searchParams.get("range") || "1mo";      // 1d, 5d, 1mo, 3mo, 6mo, 1y

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json([]);
  }

  const json = await res.json();

  const result = json?.chart?.result?.[0];
  if (!result || !result.timestamp || !result.indicators?.quote?.[0]) {
    return NextResponse.json([]);
  }

  const timestamps: number[] = result.timestamp;
  const quote = result.indicators.quote[0];

  const candles = timestamps.map((t, i) => ({
    time: t, // seconds since epoch, works with lightweight-charts
    open: quote.open[i],
    high: quote.high[i],
    low: quote.low[i],
    close: quote.close[i],
  })).filter(c => c.open != null && c.high != null && c.low != null && c.close != null);

  return NextResponse.json(candles);
}

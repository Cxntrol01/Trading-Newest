import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const symbol = searchParams.get("symbol") || "AAPL";
  const interval = searchParams.get("interval") || "1D";

  // Yahoo interval mapping
  const yahooIntervalMap: Record<string, string> = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "30m": "30m",
    "1H": "60m",
    "1D": "1d",
    "1W": "1wk",
    "1M": "1mo",
  };

  // Yahoo range rules (free + max history)
  const yahooRangeMap: Record<string, string> = {
    "1m": "1d",     // Yahoo only gives 1 day of 1m
    "5m": "1mo",
    "15m": "2mo",
    "30m": "2mo",
    "1H": "2y",
    "1D": "max",    // Full 6+ years
    "1W": "max",
    "1M": "max",
  };

  const yfInterval = yahooIntervalMap[interval] || "1d";
  const yfRange = yahooRangeMap[interval] || "1mo";

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${yfInterval}&range=${yfRange}`;

  const res = await fetch(url);
  if (!res.ok) return NextResponse.json([]);

  const json = await res.json();
  const result = json?.chart?.result?.[0];

  if (!result?.timestamp || !result?.indicators?.quote?.[0]) {
    return NextResponse.json([]);
  }

  const timestamps: number[] = result.timestamp;
  const quote = result.indicators.quote[0];
  const volume = quote.volume || [];

  const candles = timestamps
    .map((t, i) => ({
      time: t,
      open: quote.open[i],
      high: quote.high[i],
      low: quote.low[i],
      close: quote.close[i],
      volume: volume[i] ?? 1,
    }))
    .filter(
      (c) =>
        c.open != null &&
        c.high != null &&
        c.low != null &&
        c.close != null
    );

  return NextResponse.json(candles);
}

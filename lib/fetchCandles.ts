export async function fetchCandles(symbol: string, timeframe: string) {
  try {
    const isCrypto = symbol.toUpperCase().includes("USDT");

    if (isCrypto) {
      // -----------------------------
      // CRYPTO (BINANCE)
      // -----------------------------
      const binanceInterval = timeframe; // same naming (1m, 5m, 1h, etc.)

      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${binanceInterval}&limit=500`;

      const res = await fetch(url);
      const data = await res.json();

      const candles = data.map((c: any) => ({
        time: c[0], // ms timestamp
        open: parseFloat(c[1]),
        high: parseFloat(c[2]),
        low: parseFloat(c[3]),
        close: parseFloat(c[4]),
        volume: parseFloat(c[5]),
      }));

      return { candles };
    }

    // -----------------------------
    // STOCKS (FINNHUB)
    // -----------------------------
    const key = process.env.NEXT_PUBLIC_FINNHUB_KEY;

    // Convert timeframe to Finnhub resolution
    const resolutionMap: Record<string, string> = {
      "1m": "1",
      "5m": "5",
      "15m": "15",
      "30m": "30",
      "1h": "60",
      "4h": "240",
      "1D": "D",
      "1W": "W",
    };

    const resolution = resolutionMap[timeframe] || "60";

    // Finnhub requires UNIX seconds, not ms
    const now = Math.floor(Date.now() / 1000);
    const from = now - 60 * 60 * 24 * 30; // last 30 days

    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${now}&token=${key}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.s !== "ok") {
      console.error("Finnhub returned no data:", data);
      return { candles: [] };
    }

    const candles = data.t.map((t: number, i: number) => ({
      time: t * 1000, // convert to ms
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i],
    }));

    return { candles };
  } catch (err) {
    console.error("fetchCandles error:", err);
    return { candles: [] };
  }
}

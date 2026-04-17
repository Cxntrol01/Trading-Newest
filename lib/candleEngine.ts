// lib/candleEngine.ts

export type LiveCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export class LiveCandleEngine {
  private candles: Record<"1s" | "5s" | "15s" | "1m", LiveCandle | null> = {
    "1s": null,
    "5s": null,
    "15s": null,
    "1m": null,
  };

  private callbacks: Record<
    "1s" | "5s" | "15s" | "1m",
    ((c: LiveCandle) => void) | undefined
  > = {
    "1s": undefined,
    "5s": undefined,
    "15s": undefined,
    "1m": undefined,
  };

  on(tf: "1s" | "5s" | "15s" | "1m", cb: (c: LiveCandle) => void) {
    this.callbacks[tf] = cb;
  }

  pushTrade(price: number, size: number, ts: number) {
    const frames = {
      "1s": ts - (ts % 1),
      "5s": ts - (ts % 5),
      "15s": ts - (ts % 15),
      "1m": ts - (ts % 60),
    } as const;

    // ⭐ Strongly typed loop — fixes your TS error
    for (const tf of Object.keys(frames) as Array<
      "1s" | "5s" | "15s" | "1m"
    >) {
      const bucket = frames[tf];

      // New candle
      if (!this.candles[tf] || this.candles[tf]!.time !== bucket) {
        this.candles[tf] = {
          time: bucket,
          open: price,
          high: price,
          low: price,
          close: price,
          volume: size,
        };
      } else {
        // Update existing candle
        const c = this.candles[tf]!;
        c.high = Math.max(c.high, price);
        c.low = Math.min(c.low, price);
        c.close = price;
        c.volume += size;
      }

      // Emit update
      this.callbacks[tf]?.(this.candles[tf]!);
    }
  }
}

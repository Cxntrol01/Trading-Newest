export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export class LiveCandleEngine {
  private candles: Record<string, Candle | null> = {};
  private callbacks: Record<string, (c: Candle) => void> = {};

  constructor(private symbol: string) {}

  on(tf: string, cb: (c: Candle) => void) {
    this.callbacks[tf] = cb;
  }

  pushTrade(price: number, size: number, ts: number) {
    const frames = {
      "1s": ts - (ts % 1),
      "5s": ts - (ts % 5),
      "15s": ts - (ts % 15),
      "1m": ts - (ts % 60),
    };

    for (const tf in frames) {
      const bucket = frames[tf];

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
        const c = this.candles[tf]!;
        c.high = Math.max(c.high, price);
        c.low = Math.min(c.low, price);
        c.close = price;
        c.volume += size;
      }

      this.callbacks[tf]?.(this.candles[tf]!);
    }
  }
}

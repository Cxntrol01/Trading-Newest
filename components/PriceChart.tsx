"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  CandlestickData,
  HistogramData,
} from "lightweight-charts";

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type Indicators = {
  sma: boolean;
  ema: boolean;
  rsi: boolean;
  macd: boolean;
  vwap: boolean;
  bb: boolean;
  volume: boolean;
  volumeMA: boolean;
};

type IndicatorSettings = any;

type PriceChartProps = {
  symbol: string;
  timeframe: string;
  indicators: Indicators;
  indicatorSettings: IndicatorSettings;
};

const intervalMap: Record<string, string> = {
  "1m": "1",
  "5m": "5",
  "15m": "15",
  "30m": "30",
  "1H": "60",
  "1D": "D",
};

// ------------------------------------------------------------
// LIVE CANDLE ENGINE
// ------------------------------------------------------------
type LiveCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

class LiveCandleEngine {
  private candles: Record<string, LiveCandle | null> = {};
  private callbacks: Record<string, (c: LiveCandle) => void> = {};

  on(tf: "1s" | "5s" | "15s" | "1m", cb: (c: LiveCandle) => void) {
    this.callbacks[tf] = cb;
  }

  pushTrade(price: number, size: number, ts: number) {
    const frames = {
      "1s": ts - (ts % 1),
      "5s": ts - (ts % 5),
      "15s": ts - (ts % 15),
      "1m": ts - (ts % 60),
    };

    (Object.keys(frames) as Array<"1s" | "5s" | "15s" | "1m">).forEach(
      (tf) => {
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
    );
  }
}

// ------------------------------------------------------------
// INDICATOR CALCULATIONS (your original code)
// ------------------------------------------------------------
function calculateSMA(data: any[], length: number): LineData[] {
  const result: LineData[] = [];
  let sum = 0;

  data.forEach((c, i) => {
    sum += c.close;
    if (i >= length) sum -= data[i - length].close;

    if (i < length - 1) {
      result.push({ time: c.time as any, value: NaN });
    } else {
      result.push({ time: c.time as any, value: sum / length });
    }
  });

  return result;
}

function calculateEMA(data: any[], length: number): LineData[] {
  const result: LineData[] = [];
  const k = 2 / (length + 1);
  let ema = data[0]?.close ?? 0;

  data.forEach((c) => {
    ema = c.close * k + ema * (1 - k);
    result.push({ time: c.time as any, value: ema });
  });

  return result;
}

function calculateRSI(data: any[], length: number): LineData[] {
  const result: LineData[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    if (i <= length) {
      if (change > 0) gains += change;
      else losses -= change;
      result.push({ time: data[i].time as any, value: NaN });
      continue;
    }

    const avgGain = (gains * (length - 1) + Math.max(change, 0)) / length;
    const avgLoss = (losses * (length - 1) + Math.max(-change, 0)) / length;

    gains = avgGain;
    losses = avgLoss;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsiValue = 100 - 100 / (1 + rs);

    result.push({ time: data[i].time as any, value: rsiValue });
  }

  return result;
}

function calculateMACD(
  data: any[],
  fast: number,
  slow: number,
  signal: number
): LineData[] {
  const emaFast = calculateEMA(data, fast);
  const emaSlow = calculateEMA(data, slow);

  const macdLine = data.map((c, i) => ({
    time: c.time as any,
    value: emaFast[i].value! - emaSlow[i].value!,
  }));

  const signalLine = calculateEMA(macdLine, signal);

  return macdLine.map((c, i) => ({
    time: c.time as any,
    value: c.value! - signalLine[i].value!,
  }));
}

function calculateBollingerBands(
  data: any[],
  length: number,
  mult: number
) {
  const upper: LineData[] = [];
  const lower: LineData[] = [];

  data.forEach((c, i) => {
    if (i < length) {
      upper.push({ time: c.time as any, value: NaN });
      lower.push({ time: c.time as any, value: NaN });
      return;
    }

    const slice = data.slice(i - length, i);
    const mean = slice.reduce((sum, x) => sum + x.close, 0) / length;
    const variance =
      slice.reduce((sum, x) => sum + Math.pow(x.close - mean, 2), 0) /
      length;
    const std = Math.sqrt(variance);

    upper.push({ time: c.time as any, value: mean + mult * std });
    lower.push({ time: c.time as any, value: mean - mult * std });
  });

  return { upper, lower };
}

function calculateVWAP(data: any[]): LineData[] {
  let cumulativeTP = 0;
  let count = 0;

  const minPrice = Math.min(...data.map((c) => c.low));
  const maxPrice = Math.max(...data.map((c) => c.high));

  return data.map((c) => {
    const typicalPrice = (c.high + c.low + c.close) / 3;

    cumulativeTP += typicalPrice;
    count++;

    let vwap = cumulativeTP / count;

    if (vwap < minPrice) vwap = minPrice;
    if (vwap > maxPrice) vwap = maxPrice;

    return { time: c.time as any, value: vwap };
  });
}

// ------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------
export default function PriceChart({
  symbol,
  timeframe,
  indicators,
  indicatorSettings,
}: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const smaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const emaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const rsiRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbUpperRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbLowerRef = useRef<ISeriesApi<"Line"> | null>(null);
  const vwapRef = useRef<ISeriesApi<"Line"> | null>(null);

  const candleDataRef = useRef<CandlestickData[]>([]);

  // ------------------------------------------------------------
  // INIT CHART
  // ------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: "#020617" },
        textColor: "#e5e7eb",
      },
      grid: {
        vertLines: { color: "#111827" },
        horzLines: { color: "#111827" },
      },
      rightPriceScale: {
        borderColor: "#1f2937",
      },
      timeScale: {
        borderColor: "#1f2937",
      },
    });

    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    candleRef.current = candleSeries;

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
      color: "#4b5563",
    });

    volumeRef.current = volumeSeries;

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  // ------------------------------------------------------------
  // FETCH HISTORICAL CANDLES
  // ------------------------------------------------------------
  useEffect(() => {
    if (!chartRef.current || !candleRef.current) return;

    fetch(
      `/api/candles?symbol=${symbol}&interval=${intervalMap[timeframe]}&range=1mo`
    )
      .then((res) => res.json())
      .then((raw) => {
        const data = raw.map((c: any) => ({
          time: c.time as any,
          open: Number(c.open ?? c.close ?? 0),
          high: Number(c.high ?? c.close ?? 0),
          low: Number(c.low ?? c.close ?? 0),
          close: Number(c.close ?? c.open ?? 0),
          volume: Number(c.volume ?? 1),
        }));

        candleDataRef.current = data;
        candleRef.current!.setData(data);

        const volumeData: HistogramData[] = data.map((c: any) => ({
          time: c.time as any,
          value: c.volume,
          color:
            c.close >= c.open
              ? indicatorSettings.volume.colorUp
              : indicatorSettings.volume.colorDown,
        }));

        if (volumeRef.current) {
          volumeRef.current.setData(volumeData);
        }

        // Reset indicators
        smaRef.current?.setData([]);
        emaRef.current?.setData([]);
        rsiRef.current?.setData([]);
        macdRef.current?.setData([]);
        bbUpperRef.current?.setData([]);
        bbLowerRef.current?.setData([]);
        vwapRef.current?.setData([]);

        const chart = chartRef.current!;

        // SMA
        if (indicators.sma) {
          const { length, color, width } = indicatorSettings.sma;
          smaRef.current = chart.addLineSeries({
            color,
            lineWidth: width,
            priceScaleId: "right",
          });
          smaRef.current.setData(calculateSMA(data, length));
        }

        // EMA
        if (indicators.ema) {
          const { length, color, width } = indicatorSettings.ema;
          emaRef.current = chart.addLineSeries({
            color,
            lineWidth: width,
            priceScaleId: "right",
          });
          emaRef.current.setData(calculateEMA(data, length));
        }

        // RSI
        if (indicators.rsi) {
          const { length, color } = indicatorSettings.rsi;

          chart.priceScale("rsi").applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
          });

          rsiRef.current = chart.addLineSeries({
            color,
            lineWidth: 2,
            priceScaleId: "rsi",
          });

          rsiRef.current.setData(calculateRSI(data, length));
        }

        // MACD
        if (indicators.macd) {
          const { fast, slow, signal, color } = indicatorSettings.macd;

          macdRef.current = chart.addLineSeries({
            color,
            lineWidth: 2,
            priceScaleId: "right",
          });

          macdRef.current.setData(
            calculateMACD(data, fast, slow, signal)
          );
        }

        // Bollinger Bands
        if (indicators.bb) {
          const { length, mult, color } = indicatorSettings.bb;
          const { upper, lower } = calculateBollingerBands(
            data,
            length,
            mult
          );

          bbUpperRef.current = chart.addLineSeries({
            color,
            lineWidth: 1,
            priceScaleId: "right",
          });
          bbLowerRef.current = chart.addLineSeries({
            color,
            lineWidth: 1,
            priceScaleId: "right",
          });

          bbUpperRef.current.setData(upper);
          bbLowerRef.current.setData(lower);
        }

        // VWAP
        if (indicators.vwap) {
          const { color, width } = indicatorSettings.vwap;

          vwapRef.current = chart.addLineSeries({
            color,
            lineWidth: width,
            priceScaleId: "right",
          });

          vwapRef.current.setData(calculateVWAP(data));
        }
      });
  }, [symbol, timeframe, indicators, indicatorSettings]);

  // ------------------------------------------------------------
  // LIVE UPDATES (1s / 5s / 15s / 1m)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!candleRef.current) return;

    const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      console.warn("Missing NEXT_PUBLIC_FINNHUB_API_KEY");
      return;
    }

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`);
    const engine = new LiveCandleEngine();

    const tfMap: Record<string, "1s" | "5s" | "15s" | "1m"> = {
      "1m": "1s",
      "5m": "5s",
      "15m": "15s",
      "30m": "1m",
      "1H": "1m",
      "1D": "1m",
    };

    const activeFrame = tfMap[timeframe] ?? "1m";

    engine.on(activeFrame, (c) => {
      candleRef.current?.update({
        time: c.time as any,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      });

      if (volumeRef.current) {
        volumeRef.current.update({
          time: c.time as any,
          value: c.volume,
          color:
            c.close >= c.open
              ? indicatorSettings.volume.colorUp
              : indicatorSettings.volume.colorDown,
        });
      }

      if (indicators.vwap && vwapRef.current) {
        const typical = (c.high + c.low + c.close) / 3;
        vwapRef.current.update({
          time: c.time as any,
          value: typical,
        });
      }
    });

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type !== "trade") return;

      msg.data.forEach((t: any) => {
        const price = t.p;
        const size = t.v ?? 1;
        const ts = Math.floor(t.t / 1000);
        engine.pushTrade(price, size, ts);
      });
    };

    return () => {
      try {
        ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
      } catch {}
      ws.close();
    };
  }, [symbol, timeframe, indicators.vwap, indicatorSettings.volume]);

  return <div ref={containerRef} className="w-full h-full" />;
}

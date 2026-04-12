"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  HistogramData,
  CrosshairMode,
} from "lightweight-charts";

type Indicators = {
  sma: boolean;
  ema: boolean;
  rsi: boolean;
  macd: boolean;
  vwap: boolean;
  bb: boolean;
};

export default function PriceChart({
  symbol,
  timeframe,
  indicators,
}: {
  symbol: string;
  timeframe: string;
  indicators: Indicators;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // Track all series manually
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const smaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const emaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const rsiRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbUpperRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bbLowerRef = useRef<ISeriesApi<"Line"> | null>(null);
  const vwapRef = useRef<ISeriesApi<"Line"> | null>(null);

  const intervalMap: Record<string, string> = {
    "1D": "1d",
    "1H": "1h",
    "30m": "30m",
    "15m": "15m",
    "5m": "5m",
  };

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: "#000" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    chartRef.current = chart;

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

  // Load candles + indicators
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // Remove old series
    [
      candleRef,
      volumeRef,
      smaRef,
      emaRef,
      rsiRef,
      macdRef,
      bbUpperRef,
      bbLowerRef,
      vwapRef,
    ].forEach((ref) => {
      if (ref.current) {
        chart.removeSeries(ref.current);
        ref.current = null;
      }
    });

    // Create new series
    candleRef.current = chart.addCandlestickSeries();

    volumeRef.current = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    fetch(
      `/api/candles?symbol=${symbol}&interval=${intervalMap[timeframe]}&range=1mo`
    )
      .then((res) => res.json())
      .then((data) => {
        candleRef.current?.setData(data);

        // Volume
        const volumeData: HistogramData[] = data.map((c: any) => ({
          time: c.time,
          value: c.volume ?? 0,
          color: c.close >= c.open ? "#22c55e" : "#ef4444",
        }));
        volumeRef.current?.setData(volumeData);

        // --------------------
        // Bollinger Bands
        // --------------------
        if (indicators.bb) {
          const bb = calculateBollingerBands(data, 20, 2);

          bbUpperRef.current = chart.addLineSeries({
            color: "#f97316",
            lineWidth: 1,
          });
          bbLowerRef.current = chart.addLineSeries({
            color: "#f97316",
            lineWidth: 1,
          });

          bbUpperRef.current.setData(bb.upper);
          bbLowerRef.current.setData(bb.lower);
        }

        // --------------------
        // VWAP
        // --------------------
        if (indicators.vwap) {
          vwapRef.current = chart.addLineSeries({
            color: "#a855f7",
            lineWidth: 2,
          });
          vwapRef.current.setData(calculateVWAP(data));
        }

        // --------------------
        // SMA
        // --------------------
        if (indicators.sma) {
          smaRef.current = chart.addLineSeries({
            color: "#4ade80",
            lineWidth: 2,
          });
          smaRef.current.setData(calculateSMA(data, 14));
        }

        // --------------------
        // EMA
        // --------------------
        if (indicators.ema) {
          emaRef.current = chart.addLineSeries({
            color: "#60a5fa",
            lineWidth: 2,
          });
          emaRef.current.setData(calculateEMA(data, 14));
        }

        // --------------------
        // RSI
        // --------------------
        if (indicators.rsi) {
          chart.priceScale("rsi").applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
          });

          rsiRef.current = chart.addLineSeries({
            color: "#fbbf24",
            lineWidth: 2,
            priceScaleId: "rsi",
          });

          rsiRef.current.setData(calculateRSI(data, 14));
        }

        // --------------------
        // MACD
        // --------------------
        if (indicators.macd) {
          chart.priceScale("macd").applyOptions({
            scaleMargins: { top: 0.6, bottom: 0 },
          });

          macdRef.current = chart.addLineSeries({
            color: "#f472b6",
            lineWidth: 2,
            priceScaleId: "macd",
          });

          macdRef.current.setData(calculateMACD(data));
        }
      });
  }, [symbol, timeframe, indicators]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black rounded-lg overflow-hidden"
    />
  );
}

// ---------- INDICATORS ----------

function calculateSMA(data: any[], length: number): LineData[] {
  return data.map((c, i) => {
    if (i < length) return { time: c.time, value: undefined };
    const slice = data.slice(i - length, i);
    const avg = slice.reduce((sum: number, x: any) => sum + x.close, 0) / length;
    return { time: c.time, value: avg };
  });
}

function calculateEMA(data: any[], length: number): LineData[] {
  let emaPrev = data[0].close;
  const k = 2 / (length + 1);

  return data.map((c, i) => {
    if (i === 0) return { time: c.time, value: emaPrev };
    const ema = c.close * k + emaPrev * (1 - k);
    emaPrev = ema;
    return { time: c.time, value: ema };
  });
}

function calculateRSI(data: any[], length: number): LineData[] {
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= length; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / length;
  let avgLoss = losses / length;

  return data.map((c, i) => {
    if (i < length) return { time: c.time, value: undefined };

    const diff = data[i].close - data[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (length - 1) + gain) / length;
    avgLoss = (avgLoss * (length - 1) + loss) / length;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsiValue = 100 - 100 / (1 + rs);

    return { time: c.time, value: rsiValue };
  });
}

function calculateMACD(data: any[]): LineData[] {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);

  return data.map((c, i) => ({
    time: c.time,
    value: ema12[i].value! - ema26[i].value!,
  }));
}

function calculateBollingerBands(
  data: any[],
  length: number,
  mult: number
): { upper: LineData[]; lower: LineData[] } {
  const upper: LineData[] = [];
  const lower: LineData[] = [];

  data.forEach((c, i) => {
    if (i < length) {
      upper.push({ time: c.time, value: undefined });
      lower.push({ time: c.time, value: undefined });
      return;
    }

    const slice = data.slice(i - length, i);
    const mean =
      slice.reduce((sum: number, x: any) => sum + x.close, 0) / length;
    const variance =
      slice.reduce(
        (sum: number, x: any) => sum + Math.pow(x.close - mean, 2),
        0
      ) / length;
    const std = Math.sqrt(variance);

    upper.push({ time: c.time, value: mean + mult * std });
    lower.push({ time: c.time, value: mean - mult * std });
  });

  return { upper, lower };
}

function calculateVWAP(data: any[]): LineData[] {
  let cumulativePV = 0;
  let cumulativeVolume = 0;

  return data.map((c) => {
    const typicalPrice = (c.high + c.low + c.close) / 3;
    const volume = c.volume ?? 0;

    cumulativePV += typicalPrice * volume;
    cumulativeVolume += volume || 1;

    const vwap = cumulativePV / cumulativeVolume;

    return { time: c.time, value: vwap };
  });
        }

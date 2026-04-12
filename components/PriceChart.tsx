"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  UTCTimestamp,
  LineStyle,
} from "lightweight-charts";

type Indicators = {
  sma: boolean;
  ema: boolean;
  rsi: boolean;
  macd: boolean;
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

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: "#000000" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    const candleSeries = chart.addCandlestickSeries();

    // Convert timeframe to API interval
    const interval =
      timeframe === "1D"
        ? "1d"
        : timeframe === "1H"
        ? "1h"
        : timeframe === "30m"
        ? "30m"
        : timeframe === "15m"
        ? "15m"
        : "5m";

    fetch(`/api/candles?symbol=${symbol}&interval=${interval}&range=1mo`)
      .then((res) => res.json())
      .then((data) => {
        candleSeries.setData(data);

        // -----------------------------
        // SMA / EMA overlays
        // -----------------------------
        if (indicators.sma) {
          const smaSeries = chart.addLineSeries({
            color: "#4ade80",
            lineWidth: 2,
          });

          const sma = calculateSMA(data, 14);
          smaSeries.setData(sma);
        }

        if (indicators.ema) {
          const emaSeries = chart.addLineSeries({
            color: "#60a5fa",
            lineWidth: 2,
          });

          const ema = calculateEMA(data, 14);
          emaSeries.setData(ema);
        }

        // -----------------------------
        // RSI + MACD placeholders
        // (I can fully implement these next)
        // -----------------------------
        if (indicators.rsi) {
          console.log("RSI enabled — ready to implement");
        }

        if (indicators.macd) {
          console.log("MACD enabled — ready to implement");
        }
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
  }, [symbol, timeframe, indicators]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black rounded-lg overflow-hidden"
    />
  );
}

// --------------------------------------------------
// Indicator Calculations
// --------------------------------------------------

function calculateSMA(data: any[], length: number) {
  const result: any[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < length) continue;

    const slice = data.slice(i - length, i);
    const avg =
      slice.reduce((sum: number, c: any) => sum + c.close, 0) / length;

    result.push({
      time: data[i].time as UTCTimestamp,
      value: avg,
    });
  }

  return result;
}

function calculateEMA(data: any[], length: number) {
  const result: any[] = [];
  const k = 2 / (length + 1);

  let emaPrev = data[0].close;

  for (let i = 1; i < data.length; i++) {
    const close = data[i].close;
    const ema = close * k + emaPrev * (1 - k);
    emaPrev = ema;

    result.push({
      time: data[i].time as UTCTimestamp,
      value: ema,
    });
  }

  return result;
}

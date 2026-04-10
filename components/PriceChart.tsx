"use client";

import {
  createChart,
  ColorType,
  UTCTimestamp,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { fetchCandles } from "@/lib/fetchCandles";

export default function PriceChart({
  symbol,
  timeframe,
  indicators,
}: {
  symbol: string;
  timeframe: string;
  indicators: any;
}) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [loading, setLoading] = useState(true);

  // -----------------------------
  // SMA + EMA CALCULATIONS
  // -----------------------------
  function calculateSMA(data: any[], length: number) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < length) continue;
      const slice = data.slice(i - length, i);
      const avg =
        slice.reduce((sum, c) => sum + c.close, 0) / slice.length;
      result.push({ time: data[i].time, value: avg });
    }
    return result;
  }

  function calculateEMA(data: any[], length: number) {
    const result = [];
    const k = 2 / (length + 1);
    let emaPrev = data[0]?.close;

    for (let i = 1; i < data.length; i++) {
      const close = data[i].close;
      const ema = close * k + emaPrev * (1 - k);
      emaPrev = ema;
      result.push({ time: data[i].time, value: ema });
    }
    return result;
  }

  // -----------------------------
  // INITIAL CHART SETUP
  // -----------------------------
  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#000000" },
        textColor: "#FFFFFF",
      },
      grid: {
        vertLines: { color: "#222" },
        horzLines: { color: "#222" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
    });

    candleSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "#0ECB81",
      downColor: "#F6465D",
      borderUpColor: "#0ECB81",
      borderDownColor: "#F6465D",
      wickUpColor: "#0ECB81",
      wickDownColor: "#F6465D",
    });

    smaSeriesRef.current = chartRef.current.addLineSeries({
      color: "#FFD700",
      lineWidth: 2,
    });

    emaSeriesRef.current = chartRef.current.addLineSeries({
      color: "#0099FF",
      lineWidth: 2,
    });

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, []);

  // -----------------------------
  // LOAD CANDLES
  // -----------------------------
  useEffect(() => {
    async function load() {
      setLoading(true);

      const { candles } = await fetchCandles(symbol, timeframe);

      if (!candles || candles.length === 0) {
        setLoading(false);
        return;
      }

      const fixed = candles.map((c: any) => ({
        time: (c.time / 1000) as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));

      candleSeriesRef.current?.setData(fixed);

      // -----------------------------
      // INDICATORS
      // -----------------------------
      if (indicators.sma) {
        smaSeriesRef.current?.setData(calculateSMA(fixed, 20));
      } else {
        smaSeriesRef.current?.setData([]);
      }

      if (indicators.ema) {
        emaSeriesRef.current?.setData(calculateEMA(fixed, 50));
      } else {
        emaSeriesRef.current?.setData([]);
      }

      setLoading(false);
    }

    load();
  }, [symbol, timeframe, indicators]);

  return (
    <div className="w-full">
      {loading && (
        <div className="text-gray-400 text-sm mb-2">Loading chart…</div>
      )}
      <div ref={chartContainerRef} className="w-full h-[350px]" />
    </div>
  );
}

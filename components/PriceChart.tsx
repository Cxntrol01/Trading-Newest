"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
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

  // Keep references to indicator series so we can remove them
  const smaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const emaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const rsiRef = useRef<ISeriesApi<"Line"> | null>(null);
  const macdRef = useRef<ISeriesApi<"Line"> | null>(null);

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
  // Load candles + indicators whenever symbol/timeframe/indicators change
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;

    // Clear old series
    chart.getSeries().forEach((s) => chart.removeSeries(s));

    const candleSeries = chart.addCandlestickSeries();

    fetch(
      `/api/candles?symbol=${symbol}&interval=${intervalMap[timeframe]}&range=1mo`
    )
      .then((res) => res.json())
      .then((data) => {
        candleSeries.setData(data);

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
        // RSI (separate pane)
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
        // MACD (separate pane)
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
}// ----------------------
// INDICATOR FUNCTIONS
// ----------------------

function calculateSMA(data: any[], length: number) {
  return data.map((c, i) => {
    if (i < length) return { time: c.time, value: null };
    const slice = data.slice(i - length, i);
    const avg = slice.reduce((sum, x) => sum + x.close, 0) / length;
    return { time: c.time, value: avg };
  });
}

function calculateEMA(data: any[], length: number) {
  let emaPrev = data[0].close;
  const k = 2 / (length + 1);

  return data.map((c, i) => {
    if (i === 0) return { time: c.time, value: emaPrev };
    const ema = c.close * k + emaPrev * (1 - k);
    emaPrev = ema;
    return { time: c.time, value: ema };
  });
}

function calculateRSI(data: any[], length: number) {
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
    if (i < length) return { time: c.time, value: null };

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

function calculateMACD(data: any[]) {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);

  return data.map((c, i) => ({
    time: c.time,
    value: ema12[i].value - ema26[i].value,
  }));

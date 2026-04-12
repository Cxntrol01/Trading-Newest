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
  indicatorSettings,
}: {
  symbol: string;
  timeframe: string;
  indicators: Indicators;
  indicatorSettings: any;
}) {
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

  const candleDataRef = useRef<any[]>([]);

  const intervalMap: Record<string, string> = {
    "1D": "1d",
    "1H": "1h",
    "30m": "30m",
    "15m": "15m",
    "5m": "5m",
  };

  // ------------------------------------------------------------
  // 1) CREATE CHART (ONCE)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: { background: { color: "#000" }, textColor: "#d1d5db" },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    chartRef.current = chart;

    candleRef.current = chart.addCandlestickSeries();

    volumeRef.current = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

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
  // 2) FETCH CANDLES WHEN SYMBOL/TIMEFRAME CHANGES
  // ------------------------------------------------------------
  useEffect(() => {
    if (!chartRef.current || !candleRef.current) return;

    fetch(
      `/api/candles?symbol=${symbol}&interval=${intervalMap[timeframe]}&range=1mo`
    )
      .then((res) => res.json())
      .then((raw) => {
        const data = raw.map((c: any) => ({
          time: c.time,
          open: Number(c.open ?? c.close ?? 0),
          high: Number(c.high ?? c.close ?? 0),
          low: Number(c.low ?? c.close ?? 0),
          close: Number(c.close ?? c.open ?? 0),
          volume: Number(c.volume ?? 1),
        }));

        candleDataRef.current = data;
        candleRef.current!.setData(data);

        const volumeData: HistogramData[] = data.map((c: any) => ({
          time: c.time,
          value: c.volume,
          color: c.close >= c.open ? "#22c55e" : "#ef4444",
        }));

        volumeRef.current!.setData(volumeData);
      });
  }, [symbol, timeframe]);

  // ------------------------------------------------------------
  // 3) UPDATE INDICATORS WHEN SETTINGS OR TOGGLES CHANGE
  // ------------------------------------------------------------
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const data = candleDataRef.current;

    if (!data.length) return;

    // Remove old indicator series
    [
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

    // --------------------
    // Bollinger Bands
    // --------------------
    if (indicators.bb) {
      const { length, mult, color } = indicatorSettings.bb;
      const bb = calculateBollingerBands(data, length, mult);

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

      bbUpperRef.current.setData(bb.upper);
      bbLowerRef.current.setData(bb.lower);
    }

    // --------------------
    // VWAP
    // --------------------
    if (indicators.vwap) {
      const { color, width } = indicatorSettings.vwap;

      vwapRef.current = chart.addLineSeries({
        color,
        lineWidth: width,
        priceScaleId: "right",
      });

      vwapRef.current.setData(calculateVWAP(data));
    }

    // --------------------
    // SMA
    // --------------------
    if (indicators.sma) {
      const { length, color, width } = indicatorSettings.sma;

      smaRef.current = chart.addLineSeries({
        color,
        lineWidth: width,
        priceScaleId: "right",
      });

      smaRef.current.setData(calculateSMA(data, length));
    }

    // --------------------
    // EMA
    // --------------------
    if (indicators.ema) {
      const { length, color, width } = indicatorSettings.ema;

      emaRef.current = chart.addLineSeries({
        color,
        lineWidth: width,
        priceScaleId: "right",
      });

      emaRef.current.setData(calculateEMA(data, length));
    }

    // --------------------
    // RSI
    // --------------------
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

    // --------------------
    // MACD
    // --------------------
    if (indicators.macd) {
      const { fast, slow, signal, color } = indicatorSettings.macd;

      chart.priceScale("macd").applyOptions({
        scaleMargins: { top: 0.6, bottom: 0 },
      });

      macdRef.current = chart.addLineSeries({
        color,
        lineWidth: 2,
        priceScaleId: "macd",
      });

      macdRef.current.setData(calculateMACD(data, fast, slow, signal));
    }
  }, [JSON.stringify(indicators), JSON.stringify(indicatorSettings)]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black rounded-lg overflow-hidden"
    />
  );
}

// ------------------------------------------------------------
// INDICATOR CALCULATIONS
// ------------------------------------------------------------

function calculateSMA(data: any[], length: number): LineData[] {
  return data.map((c, i) => {
    if (i < length) return { time: c.time, value: NaN };
    const slice = data.slice(i - length, i);
    const avg = slice.reduce((sum, x) => sum + x.close, 0) / length;
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
    if (i < length) return { time: c.time, value: NaN };

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

function calculateMACD(
  data: any[],
  fast: number,
  slow: number,
  signal: number
): LineData[] {
  const emaFast = calculateEMA(data, fast);
  const emaSlow = calculateEMA(data, slow);

  const macdLine = data.map((c, i) => ({
    time: c.time,
    value: emaFast[i].value! - emaSlow[i].value!,
  }));

  const signalLine = calculateEMA(macdLine, signal);

  return macdLine.map((c, i) => ({
    time: c.time,
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
      upper.push({ time: c.time, value: NaN });
      lower.push({ time: c.time, value: NaN });
      return;
    }

    const slice = data.slice(i - length, i);
    const mean = slice.reduce((sum, x) => sum + x.close, 0) / length;
    const variance =
      slice.reduce((sum, x) => sum + Math.pow(x.close - mean, 2), 0) /
      length;
    const std = Math.sqrt(variance);

    upper.push({ time: c.time, value: mean + mult * std });
    lower.push({ time: c.time, value: mean - mult * std });
  });

  return { upper, lower };
}

// ⭐ FINAL VWAP FIX — CLAMP TO PRICE RANGE
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

    return { time: c.time, value: vwap };
  });
      }

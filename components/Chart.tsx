"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";

import { fetchCandles } from "@/lib/fetchCandles";
import { calculateSMA, calculateEMA } from "@/lib/indicators";

export default function PriceChart({
  symbol,
  timeframe,
}: {
  symbol: string;
  timeframe: string;
}) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<IChartApi | null>(null);

  const candleSeries = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const smaSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const emaSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const volumeSeries = useRef<ISeriesApi<"Histogram"> | null>(null);

  const [candles, setCandles] = useState<any[]>([]);

  const isCrypto = symbol.toUpperCase().includes("USDT");

  useEffect(() => {
    if (!chartRef.current) return;

    // Create chart once
    if (!chartInstance.current) {
      chartInstance.current = createChart(chartRef.current, {
        layout: { background: { color: "#000" }, textColor: "#fff" },
        grid: {
          vertLines: { color: "#222" },
          horzLines: { color: "#222" },
        },
        crosshair: { mode: 1 },
        width: chartRef.current.clientWidth,
        height: 400,
      });

      candleSeries.current =
        chartInstance.current.addCandlestickSeries();

      volumeSeries.current = chartInstance.current.addHistogramSeries({
        priceFormat: { type: "volume" },
        priceScaleId: "",
        color: "#26a69a",
      });

      volumeSeries.current.priceScale().applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });

      candleSeries.current.priceScale().applyOptions({
        scaleMargins: { top: 0.05, bottom: 0.25 },
      });

      smaSeries.current = chartInstance.current.addLineSeries({
        color: "#00bcd4",
        lineWidth: 2,
      });

      emaSeries.current = chartInstance.current.addLineSeries({
        color: "#ff9800",
        lineWidth: 2,
      });
    }

    async function load() {
      const data = await fetchCandles(symbol, timeframe);

      if (data?.candles) {
        const fixed = data.candles.map((c: any) => ({
          time: Math.floor(c.time / 1000),
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
          volume: c.volume,
        }));

        setCandles(fixed);

        candleSeries.current?.setData(
          fixed.map((c: any) => ({
            time: c.time as UTCTimestamp,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          }))
        );

        volumeSeries.current?.setData(
          fixed.map((c: any) => ({
            time: c.time as UTCTimestamp,
            value: c.volume,
          }))
        );

        smaSeries.current?.setData(calculateSMA(fixed, 20));
        emaSeries.current?.setData(calculateEMA(fixed, 50));
      }
    }

    load();

    // --- WebSocket for live updates ---
    let ws: WebSocket;

    if (isCrypto) {
      ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${timeframe}`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const k = data.k;

        const live = {
          time: Math.floor(k.t / 1000),
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
        };

        updateLiveCandle(live, k.x);
      };
    } else {
      ws = new WebSocket(
        `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_KEY}`
      );

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "subscribe", symbol }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type !== "trade") return;

        const t = msg.data[0];

        const live = {
          time: Math.floor(t.t / 1000),
          open: t.p,
          high: t.p,
          low: t.p,
          close: t.p,
          volume: t.v,
        };

        updateLiveCandle(live, false);
      };
    }

    function updateLiveCandle(live: any, closed: boolean) {
      setCandles((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        if (!closed) {
          updated[lastIndex] = live;
        } else {
          updated[lastIndex] = live;
          updated.push(live);
        }

        candleSeries.current?.update({
          time: live.time as UTCTimestamp,
          open: live.open,
          high: live.high,
          low: live.low,
          close: live.close,
        });

        volumeSeries.current?.update({
          time: live.time as UTCTimestamp,
          value: live.volume,
        });

        smaSeries.current?.setData(calculateSMA(updated, 20));
        emaSeries.current?.setData(calculateEMA(updated, 50));

        return updated;
      });
    }

    return () => ws.close();
  }, [symbol, timeframe]);

  // --- Tooltips ---
  useEffect(() => {
    if (!chartInstance.current || !candleSeries.current) return;

    const priceTooltip = document.getElementById("price-tooltip");
    const timeTooltip = document.getElementById("time-tooltip");

    chartInstance.current.subscribeCrosshairMove((param) => {
      const p = param as any;

      if (!p || !p.time || !p.seriesPrices) {
        priceTooltip!.style.display = "none";
        timeTooltip!.style.display = "none";
        return;
      }

      const candlePrice = p.seriesPrices.get(candleSeries.current!);

      if (candlePrice) {
        priceTooltip!.innerText = candlePrice.close.toFixed(2);
        priceTooltip!.style.display = "block";
        priceTooltip!.style.top = p.point?.y + "px";
      }

      const utc = new Date((p.time as number) * 1000);
      timeTooltip!.innerText = utc.toLocaleString();
      timeTooltip!.style.display = "block";
      timeTooltip!.style.left = p.point?.x + "px";
    });
  }, []);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={chartRef} className="absolute inset-0" />

      <div
        id="price-tooltip"
        className="absolute right-0 bg-black/80 text-white px-2 py-1 text-sm rounded hidden pointer-events-none"
      ></div>

      <div
        id="time-tooltip"
        className="absolute bottom-0 bg-black/80 text-white px-2 py-1 text-sm rounded hidden pointer-events-none"
      ></div>
    </div>
  );
                 }

"use client";

import { useEffect, useRef } from "react";

export default function Chart({ refreshRate }: { refreshRate: number }) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tvScript = document.createElement("script");
    tvScript.src = "https://s3.tradingview.com/tv.js";
    tvScript.async = true;

    tvScript.onload = () => {
      if (window.TradingView && chartRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "AAPL",
          interval: "1",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          container_id: chartRef.current.id,
        });
      }
    };

    document.body.appendChild(tvScript);

    return () => {
      tvScript.remove();
    };
  }, [refreshRate]); // optional: re-run when refreshRate changes

  return (
    <div
      id="tradingview_chart"
      ref={chartRef}
      style={{ width: "100%", height: "500px" }}
    />
  );
}

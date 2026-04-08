"use client";

import { useEffect, useRef } from "react";

export default function Chart() {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure this only runs in the browser
    if (typeof window === "undefined") return;

    // Create script element
    const tvScript = document.createElement("script");
    tvScript.src = "https://s3.tradingview.com/tv.js";
    tvScript.async = true;

    tvScript.onload = () => {
      // Ensure TradingView exists AND ref exists
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

    // Cleanup on unmount
    return () => {
      tvScript.remove();
    };
  }, []);

  return (
    <div
      id="tradingview_chart"
      ref={chartRef}
      style={{ width: "100%", height: "500px" }}
    />
  );
}

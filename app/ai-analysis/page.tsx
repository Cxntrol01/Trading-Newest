"use client";

import { useState } from "react";

export default function AIAnalysisPage() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setAnalysis(null);

    // Simulated AI response for now
    setTimeout(() => {
      setAnalysis(
        `Here’s a structured breakdown of **${input}**:\n\n` +
        `• Market sentiment: Neutral\n` +
        `• Volatility outlook: Moderate\n` +
        `• Key drivers: Earnings, macro data, liquidity\n` +
        `• Suggested focus: Trend strength, volume confirmation\n\n` +
        `This is placeholder logic — you can wire this to your real AI endpoint later.`
      );
      setLoading(false);
    }, 900);
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-6 pb-20">

      <h1 className="text-2xl font-semibold mb-2">AI Market Analysis</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter a stock, market question, or strategy idea and get instant AI insights.
      </p>

      {/* Input box */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Example: Analyse AAPL price action and trend strength"
        className="
          w-full h-32 p-4 rounded-xl
          bg-gray-100 dark:bg-gray-900
          border border-gray-300 dark:border-gray-700
          text-black dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition
        "
      />

      {/* Run button */}
      <button
        onClick={runAnalysis}
        className="
          mt-4 w-full py-3 rounded-xl font-medium
          bg-blue-600 hover:bg-blue-700
          text-white transition
        "
      >
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>

      {/* Output */}
      {analysis && (
        <div
          className="
            mt-6 p-5 rounded-xl whitespace-pre-line
            bg-gray-200 dark:bg-gray-800
            border border-gray-300 dark:border-gray-700
            text-black dark:text-white
          "
        >
          {analysis}
        </div>
      )}
    </div>
  );
}

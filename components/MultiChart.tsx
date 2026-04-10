"use client";

import { useState } from "react";

export default function MultiChart() {
  const [layout, setLayout] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      {/* Layout buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setLayout(1)}
          className={`px-3 py-1.5 rounded border ${
            layout === 1
              ? "bg-blue-600 border-blue-500"
              : "bg-gray-800 border-gray-700 hover:bg-gray-700"
          }`}
        >
          1 Chart
        </button>

        <button
          onClick={() => setLayout(2)}
          className={`px-3 py-1.5 rounded border ${
            layout === 2
              ? "bg-blue-600 border-blue-500"
              : "bg-gray-800 border-gray-700 hover:bg-gray-700"
          }`}
        >
          2 Charts
        </button>

        <button
          onClick={() => setLayout(4)}
          className={`px-3 py-1.5 rounded border ${
            layout === 4
              ? "bg-blue-600 border-blue-500"
              : "bg-gray-800 border-gray-700 hover:bg-gray-700"
          }`}
        >
          4 Charts
        </button>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-6 ${
          layout === 1
            ? "grid-cols-1"
            : layout === 2
            ? "grid-cols-2"
            : "grid-cols-2"
        }`}
      >
        {Array.from({ length: layout }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-800 rounded-lg bg-gray-900/40 h-[400px] flex items-center justify-center"
          >
            <p className="text-gray-500">Chart {i + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

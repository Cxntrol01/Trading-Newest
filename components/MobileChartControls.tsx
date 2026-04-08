"use client";

export default function MobileChartControls() {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg mt-3">
      <button className="px-3 py-2 bg-gray-800 rounded text-sm">
        Buy
      </button>

      <button className="px-3 py-2 bg-gray-800 rounded text-sm">
        Sell
      </button>

      <button className="px-3 py-2 bg-gray-800 rounded text-sm">
        Indicators
      </button>

      <button className="px-3 py-2 bg-gray-800 rounded text-sm">
        Settings
      </button>
    </div>
  );
}

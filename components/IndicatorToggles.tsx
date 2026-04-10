"use client";

export default function IndicatorToggles({
  indicators,
  onChange,
}: {
  indicators: any;
  onChange: (updates: any) => void;
}) {
  function toggle(key: string) {
    onChange({ [key]: !indicators[key] });
  }

  return (
    <div className="flex gap-2 flex-wrap mb-2">
      {[
        { key: "sma", label: "SMA" },
        { key: "ema", label: "EMA" },
        { key: "rsi", label: "RSI" },
        { key: "macd", label: "MACD" },
        { key: "bb", label: "BB" },
      ].map((item) => (
        <button
          key={item.key}
          onClick={() => toggle(item.key)}
          className={`px-3 py-1 rounded ${
            indicators[item.key] ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

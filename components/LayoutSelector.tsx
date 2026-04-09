"use client";

import { useState } from "react";

interface LayoutSelectorProps {
  onChange?: (layout: number) => void;
}

export default function LayoutSelector({ onChange }: LayoutSelectorProps) {
  const [layout, setLayout] = useState(1);

  const handleSelect = (value: number) => {
    setLayout(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="p-3 bg-gray-900 rounded-lg space-y-3">
      <h3 className="text-sm font-semibold text-white">Layout</h3>

      <div className="flex space-x-2">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => handleSelect(num)}
            className={`px-3 py-2 rounded text-sm ${
              layout === num ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function ThemeSelector() {
  const [theme, setTheme] = useState("dark");

  return (
    <div className="p-3 bg-gray-900 rounded-lg space-y-3">
      <h3 className="text-sm font-semibold text-white">Theme</h3>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="w-full bg-gray-800 text-white p-2 rounded"
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
}

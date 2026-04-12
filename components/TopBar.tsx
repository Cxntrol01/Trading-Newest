"use client";

import { useTheme } from "./ThemeProvider";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-[9000] bg-black/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-4 h-14">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-bold">
          Cx
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Cxntre</span>
          <span className="text-[11px] text-gray-400">Trade smarter</span>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="text-xs px-2 py-1 rounded-lg border border-gray-700 bg-gray-900/80 hover:bg-gray-800 transition"
      >
        {theme === "dark" ? "Dark" : "Light"}
      </button>
    </header>
  );
}

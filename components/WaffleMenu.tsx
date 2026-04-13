"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function WaffleMenu() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    if (open) {
      setIsClosing(true);
      setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
      }, 250);
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-[99999]">
      {/* Waffle Button */}
      <button
        onClick={toggleMenu}
        className="
          p-3 rounded-xl 
          bg-gray-200 dark:bg-gray-900 
          border border-gray-400 dark:border-gray-700
          hover:bg-gray-300 dark:hover:bg-gray-800
          transition shadow-xl
        "
      >
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-black dark:bg-white rounded-sm"
            ></span>
          ))}
        </div>
      </button>

      {/* Menu Panel */}
      {open && (
        <div
          className={`
            fixed top-20 left-4 w-64 
            bg-white/90 dark:bg-black/95 
            backdrop-blur-xl 
            border border-gray-300 dark:border-gray-700 
            rounded-2xl shadow-2xl p-5 z-[99999]
            ${isClosing ? "animate-slideUpMenu" : "animate-slideDownMenu"}
          `}
        >
          <div className="grid grid-cols-1 gap-4 text-sm">

            {/* Home */}
            <Link
              href="/"
              className="
                p-3 rounded-lg 
                bg-gray-200 dark:bg-gray-800 
                hover:bg-gray-300 dark:hover:bg-gray-700
                border border-gray-300 dark:border-gray-700
                transition font-medium
              "
            >
              Home
            </Link>

            {/* Workspace */}
            <Link
              href="/workspace"
              className="
                p-3 rounded-lg 
                bg-gray-200 dark:bg-gray-800 
                hover:bg-gray-300 dark:hover:bg-gray-700
                border border-gray-300 dark:border-gray-700
                transition font-medium
              "
            >
              Workspace
            </Link>

            {/* Watchlist */}
            <Link
              href="/watchlist"
              className="
                p-3 rounded-lg 
                bg-gray-200 dark:bg-gray-800 
                hover:bg-gray-300 dark:hover:bg-gray-700
                border border-gray-300 dark:border-gray-700
                transition font-medium
              "
            >
              Watchlist
            </Link>

            {/* Settings */}
            <Link
              href="/settings"
              className="
                p-3 rounded-lg 
                bg-gray-200 dark:bg-gray-800 
                hover:bg-gray-300 dark:hover:bg-gray-700
                border border-gray-300 dark:border-gray-700
                transition font-medium
              "
            >
              Settings
            </Link>

            {/* AI Analysis */}
            <Link
              href="/ai-analysis"
              className="
                p-3 rounded-lg 
                bg-blue-600 text-white 
                hover:bg-blue-700
                transition font-medium
              "
            >
              AI Analysis
            </Link>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="
                p-3 rounded-lg 
                bg-gray-300 dark:bg-gray-700 
                hover:bg-gray-400 dark:hover:bg-gray-600
                border border-gray-400 dark:border-gray-600
                transition font-medium
              "
            >
              Switch to {theme === "dark" ? "Light" : "Dark"} Mode
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

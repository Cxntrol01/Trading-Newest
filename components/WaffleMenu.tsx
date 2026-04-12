"use client";

import Link from "next/link";
import { useState } from "react";

export default function WaffleMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-[9999]"> 
      {/* Waffle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          p-3 ml-3 mt-3 rounded-xl 
          bg-gray-900/90 border border-gray-700 
          hover:bg-gray-800 transition shadow-xl
        "
      >
        {/* Smaller, cleaner dots */}
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <span
              key={i}
              className="w-2 h-2 bg-white/90 rounded-sm"
            ></span>
          ))}
        </div>
      </button>

      {/* Menu Panel */}
      {open && (
        <div
          className="
            absolute top-16 right-3 w-60 
            bg-black/95 backdrop-blur-xl 
            border border-gray-700 rounded-2xl 
            shadow-2xl p-5 animate-fadeIn
            z-[9999]
          "
        >
          <div className="grid grid-cols-1 gap-4 text-sm">

            <Link
              href="/"
              className="
                p-3 rounded-lg bg-gray-800/80 hover:bg-gray-700 
                transition border border-gray-700 text-white font-medium
              "
            >
              Home
            </Link>

            <Link
              href="/workspace"
              className="
                p-3 rounded-lg bg-gray-800/80 hover:bg-gray-700 
                transition border border-gray-700 text-white font-medium
              "
            >
              Workspace
            </Link>

            <Link
              href="/watchlist"
              className="
                p-3 rounded-lg bg-gray-800/80 hover:bg-gray-700 
                transition border border-gray-700 text-white font-medium
              "
            >
              Watchlist
            </Link>

            <Link
              href="/settings"
              className="
                p-3 rounded-lg bg-gray-800/80 hover:bg-gray-700 
                transition border border-gray-700 text-white font-medium
              "
            >
              Settings
            </Link>

          </div>
        </div>
      )}
    </div>
  );
}

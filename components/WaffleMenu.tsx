"use client";

import Link from "next/link";
import { useState } from "react";

export default function WaffleMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-[99999]">
      {/* Waffle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          p-3 rounded-xl 
          bg-gray-900/95 border border-gray-700 
          hover:bg-gray-800 transition shadow-xl
        "
      >
        {/* MUCH smaller dots */}
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-white/90 rounded-sm"
            ></span>
          ))}
        </div>
      </button>

      {/* Menu Panel */}
      {open && (
        <div
          className="
            fixed top-20 left-4 w-64 
            bg-black/95 backdrop-blur-xl 
            border border-gray-700 rounded-2xl 
            shadow-2xl p-5 animate-fadeIn
            z-[99999]
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

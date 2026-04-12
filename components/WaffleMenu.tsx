"use client";

import Link from "next/link";
import { useState } from "react";

export default function WaffleMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Waffle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          p-3 rounded-xl bg-gray-900/90 border border-gray-600 
          hover:bg-gray-800 transition shadow-xl
        "
      >
        {/* Larger, clearer waffle icon */}
        <div className="grid grid-cols-3 gap-1.5">
          {[...Array(9)].map((_, i) => (
            <span
              key={i}
              className="w-3.5 h-3.5 bg-white rounded-sm shadow-sm"
            ></span>
          ))}
        </div>
      </button>

      {/* Menu Panel */}
      {open && (
        <div
          className="
            absolute mt-3 right-0 w-60 
            bg-black/95 backdrop-blur-xl 
            border border-gray-700 rounded-2xl 
            shadow-2xl p-5 animate-fadeIn
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

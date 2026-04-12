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
          p-3 rounded-lg bg-gray-800 border border-gray-600 
          hover:bg-gray-700 transition shadow-lg
        "
      >
        {/* MUCH clearer waffle icon */}
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 bg-white/90 rounded-sm"
            ></span>
          ))}
        </div>
      </button>

      {/* Menu Panel */}
      {open && (
        <div
          className="
            absolute mt-3 right-0 w-56 
            bg-black/85 backdrop-blur-xl 
            border border-gray-700 rounded-xl 
            shadow-2xl p-4 animate-fadeIn
          "
        >
          <div className="grid grid-cols-1 gap-3 text-sm">

            <Link
              href="/"
              className="
                p-3 rounded-lg bg-gray-800/70 hover:bg-gray-700 
                transition border border-gray-700 text-white font-medium
              "
            >
              Home
            </Link>

            <Link
              href="/workspace"
              className="
                p-3 rounded-lg bg-gray-800/70 hover:bg-gray-700 
                transition border border-gray-700 text-white font-medium
              "
            >
              Workspace
            </Link>

            <Link
              href="/watchlist"
              className="
                p-3 rounded-lg bg-gray-800/70 hover:bg-gray-700 
                transition border border-gray-700 text-white font-medium
              "
            >
              Watchlist
            </Link>

            <Link
              href="/settings"
              className="
                p-3 rounded-lg bg-gray-800/70 hover:bg-gray-700 
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

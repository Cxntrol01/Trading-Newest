"use client";

import Link from "next/link";
import { useState } from "react";

export default function WaffleMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-800 rounded"
      >
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-white rounded-sm" />
          ))}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg p-3 w-48">
          <Link
            href="/"
            className="block px-2 py-1 hover:bg-gray-800 rounded"
          >
            Dashboard
          </Link>

          <Link
            href="/multichart"
            className="block px-2 py-1 hover:bg-gray-800 rounded"
          >
            Multi‑Chart Workspace
          </Link>
        </div>
      )}
    </div>
  );
}

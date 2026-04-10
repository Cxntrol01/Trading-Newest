"use client";

import Link from "next/link";
import WaffleMenu from "./WaffleMenu";

export default function TopBar() {
  return (
    <header className="w-full h-14 border-b border-gray-800 flex items-center px-4 justify-between bg-black/80 backdrop-blur">
      <Link href="/" className="text-xl font-bold">
        Cxntr
      </Link>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search symbols..."
          className="bg-gray-900 border border-gray-700 px-3 py-1 rounded text-sm"
        />
        <WaffleMenu />
      </div>
    </header>
  );
}

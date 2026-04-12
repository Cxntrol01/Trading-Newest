"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/settings", label: "Settings" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9000] bg-black/90 backdrop-blur-xl border-t border-gray-800 h-14 flex items-center justify-around">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center justify-center text-[11px]
              ${active ? "text-blue-400" : "text-gray-400"}
            `}
          >
            <span
              className={`
                mb-1 h-1 w-6 rounded-full 
                ${active ? "bg-blue-500" : "bg-transparent"}
              `}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

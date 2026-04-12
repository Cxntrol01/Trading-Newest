import "./globals.css";
import WaffleMenu from "@/components/WaffleMenu";
import type { ReactNode } from "react";

export const metadata = {
  title: "Cxntre",
  description: "Trading intelligence platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="relative">
        {/* GLOBAL NAV — always on top */}
        <WaffleMenu />

        {/* All pages render underneath */}
        {children}
      </body>
    </html>
  );
}

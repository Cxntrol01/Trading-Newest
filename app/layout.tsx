import "./globals.css";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/ThemeProvider";
import TopBar from "@/components/TopBar";
import WaffleMenu from "@/components/WaffleMenu";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Cxntre",
  description: "Trading intelligence platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="relative bg-black text-white">
        <ThemeProvider>
          {/* Global top bar */}
          <TopBar />

          {/* Global waffle menu (always on top) */}
          <WaffleMenu />

          {/* Page transitions */}
          <PageTransition>
            {/* Push content below the top bar */}
            <main className="pt-16">
              {children}
            </main>
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}

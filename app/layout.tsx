import "./globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import WaffleMenu from "@/components/WaffleMenu";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
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
          {/* Global top bar + waffle */}
          <TopBar />
          <WaffleMenu />

          {/* Page transition wrapper */}
          <PageTransition>
            <main className="pt-16 pb-16">
              {children}
            </main>
          </PageTransition>

          {/* Global bottom nav */}
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";

import TopBar from "./TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

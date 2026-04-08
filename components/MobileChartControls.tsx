"use client";

export default function MobileChartControls({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:hidden flex flex-col gap-3 p-3 bg-gray-900 rounded-lg">
      {children}
    </div>
  );
}

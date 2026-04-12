"use client";

import MultiChart from "@/components/MultiChart";

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-3xl font-bold">Workspace</h1>
      <MultiChart />
    </div>
  );
}

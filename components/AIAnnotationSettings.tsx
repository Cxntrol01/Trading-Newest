"use client";

import { useState } from "react";

interface AIAnnotationSettingsProps {
  onSave: (settings: any) => void;
}

export default function AIAnnotationSettings({ onSave }: AIAnnotationSettingsProps) {
  const [settings, setSettings] = useState({
    enabled: true,
    detailLevel: 3
  });

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="p-3 bg-gray-900 rounded-lg space-y-3">
      <h3 className="text-sm font-semibold text-white">AI Annotations</h3>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-300">Enabled</span>
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => handleChange("enabled", e.target.checked)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-300">Detail Level</label>
        <input
          type="range"
          min={1}
          max={5}
          value={settings.detailLevel}
          onChange={(e) => handleChange("detailLevel", Number(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full py-2 bg-blue-600 rounded text-white text-sm"
      >
        Save
      </button>
    </div>
  );
}

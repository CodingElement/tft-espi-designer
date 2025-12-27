"use client";

import { useState } from "react";
import { useDesignStore } from "@/lib/store";

const PRESET_SIZES = [
  { name: "2.4\" ILI9341", width: 320, height: 240 },
  { name: "3.5\" ILI9486", width: 480, height: 320 },
  { name: "4.0\" ILI9488", width: 480, height: 320 },
  { name: "5.0\" ILI9488", width: 800, height: 480 },
  { name: "7.0\" Nextion", width: 800, height: 480 },
  { name: "Custom", width: 0, height: 0 },
];

export default function DisplaySettings() {
  const { displayWidth, displayHeight, previewScale, setDisplaySize, setPreviewScale } = useDesignStore();
  const [isCustom, setIsCustom] = useState(false);

  const currentPreset = PRESET_SIZES.find(
    (p) => p.width === displayWidth && p.height === displayHeight
  );

  const handlePresetChange = (preset: (typeof PRESET_SIZES)[0]) => {
    if (preset.name === "Custom") {
      setIsCustom(true);
    } else {
      setDisplaySize(preset.width, preset.height);
      setIsCustom(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Display:</label>

      <select
        value={currentPreset?.name || "Custom"}
        onChange={(e) => {
          const preset = PRESET_SIZES.find((p) => p.name === e.target.value);
          if (preset) handlePresetChange(preset);
        }}
        className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white cursor-pointer hover:bg-gray-600"
      >
        {PRESET_SIZES.map((preset) => (
          <option key={preset.name} value={preset.name}>
            {preset.name}
          </option>
        ))}
      </select>

      {isCustom || (currentPreset?.name === "Custom") ? (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={displayWidth}
            onChange={(e) => setDisplaySize(parseInt(e.target.value), displayHeight)}
            className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            placeholder="Breite"
          />
          <span className="text-gray-400">×</span>
          <input
            type="number"
            value={displayHeight}
            onChange={(e) => setDisplaySize(displayWidth, parseInt(e.target.value))}
            className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            placeholder="Höhe"
          />
          <span className="text-xs text-gray-400">px</span>
        </div>
      ) : (
        <span className="text-sm text-gray-400">
          {displayWidth}×{displayHeight}
        </span>
      )}
      <div className="flex items-center gap-2 ml-4">
        <label className="text-sm font-medium">Zoom:</label>
        <select
          value={previewScale}
          onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
          className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white cursor-pointer hover:bg-gray-600"
        >
          {[0.5, 1, 1.5, 2, 3, 4].map((z) => (
            <option key={z} value={z}>{z}×</option>
          ))}
        </select>
      </div>
    </div>
  );
}

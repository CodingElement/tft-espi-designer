"use client";

import { useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [rgbInput, setRgbInput] = useState("");
  const [hexInput, setHexInput] = useState(value);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value.toUpperCase();
    if (!hex.startsWith("#")) hex = "#" + hex;
    if (hex.length === 7) {
      onChange(hex);
      setHexInput(hex);
    }
  };

  const handleRgbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rgb = e.target.value;
    setRgbInput(rgb);
    
    // Versuche RGB zu parsen: "255, 128, 64"
    const parts = rgb.split(",").map(p => parseInt(p.trim()));
    if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
      const hex = "#" + parts.map(p => p.toString(16).padStart(2, "0").toUpperCase()).join("");
      onChange(hex);
      setHexInput(hex);
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setHexInput(e.target.value);
  };

  // Hex zu RGB konvertieren
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    }
    return "";
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs text-gray-400 block">{label}</label>}
      
      {/* Color Picker Row */}
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={handleColorInputChange}
          className="w-12 h-10 rounded cursor-pointer border border-gray-700"
        />
        <input
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          placeholder="#FFFFFF"
          className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-2 text-sm text-white font-mono"
        />
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
        >
          {showAdvanced ? "−" : "+"}
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-2 pt-2 border-t border-gray-700">
          {/* RGB Input */}
          <div>
            <label className="text-xs text-gray-400">RGB (R, G, B)</label>
            <input
              type="text"
              value={rgbInput || hexToRgb(value)}
              onChange={handleRgbChange}
              placeholder="255, 128, 64"
              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white font-mono"
            />
          </div>

          {/* Color Preview */}
          <div className="flex gap-2">
            <div
              className="flex-1 h-10 rounded border border-gray-600"
              style={{ backgroundColor: value }}
            />
            <div className="flex-1 text-xs text-gray-400 flex items-center justify-center">
              {value.toUpperCase()}
            </div>
          </div>

          {/* Preset Colors */}
          <div className="grid grid-cols-4 gap-2">
            {[
              "#000000",
              "#FFFFFF",
              "#FF0000",
              "#00FF00",
              "#0000FF",
              "#FFFF00",
              "#FF00FF",
              "#00FFFF",
              "#808080",
              "#FF8000",
              "#8000FF",
              "#00FF80",
            ].map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setHexInput(color);
                }}
                className="h-8 rounded border-2 border-gray-600 hover:border-gray-400"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

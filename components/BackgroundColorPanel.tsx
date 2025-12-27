"use client";

import { useDesignStore } from "@/lib/store";
import ColorPicker from "./ColorPicker";

export default function BackgroundColorPanel() {
  const { backgroundColor, setBackgroundColor } = useDesignStore();

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <ColorPicker
        value={backgroundColor}
        onChange={setBackgroundColor}
        label="Hintergrundfarbe"
      />
    </div>
  );
}

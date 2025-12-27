"use client";

import { useState, useEffect } from "react";
import Toolbar from "@/components/Toolbar";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import PropertyPanel from "@/components/PropertyPanel";
import DisplaySettings from "@/components/DisplaySettings";
import BackgroundColorPanel from "@/components/BackgroundColorPanel";
import { useDesignStore } from "@/lib/store";
import { generateArduinoCode } from "@/lib/codeGenerator";

export default function Home() {
  const [code, setCode] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const { elements, selectedElement, displayWidth, displayHeight, backgroundColor } = useDesignStore();

  // Automatisch Code generieren wenn Elemente sich ändern
  useEffect(() => {
    if (autoSync) {
      const newCode = generateArduinoCode(elements, displayWidth, displayHeight, backgroundColor);
      setCode(newCode);
    }
  }, [elements, displayWidth, displayHeight, backgroundColor, autoSync]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">TFT-eSPI Designer</h1>
            <p className="text-sm text-gray-400">Online Editor mit Live-Vorschau</p>
          </div>
          <div className="flex items-center gap-4">
            <DisplaySettings />
            <label className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4"
              />
              Auto-Sync Code
            </label>
          </div>
        </header>

        {/* Background Color Panel */}
        <BackgroundColorPanel />
            </div>
          </div>

          {/* Property Panel */}
          {selectedElement && (
            <div className="w-64 border-l border-gray-700 overflow-auto">
              <PropertyPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

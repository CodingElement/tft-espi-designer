"use client";

import { useState, useEffect } from "react";
import Toolbar from "@/components/Toolbar";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import PropertyPanel from "@/components/PropertyPanel";
import DisplaySettings from "@/components/DisplaySettings";
import BackgroundColorPanel from "@/components/BackgroundColorPanel";
import { useDesignStore } from "@/lib/store";
import { generateArduinoCode, parseArduinoCode } from "@/lib/codeGenerator";

export default function Home() {
  const [code, setCode] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [codeModified, setCodeModified] = useState(false);
  const { elements, selectedElement, displayWidth, displayHeight, backgroundColor } = useDesignStore();

  // Automatisch Code generieren wenn Elemente sich ändern
  useEffect(() => {
    if (autoSync && !codeModified) {
      const newCode = generateArduinoCode(elements, displayWidth, displayHeight, backgroundColor);
      setCode(newCode);
    }
  }, [elements, displayWidth, displayHeight, backgroundColor, autoSync, codeModified]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setCodeModified(true);
    // Auto-Sync wird automatisch ausgeschaltet wenn User tippt
    setAutoSync(false);

    // Parse code back into design to update preview
    try {
      const parsed = parseArduinoCode(newCode);
      if (parsed.backgroundColor) {
        useDesignStore.getState().setBackgroundColor(parsed.backgroundColor);
      }
      if (parsed.elements && parsed.elements.length > 0) {
        useDesignStore.getState().setElements(parsed.elements);
      }
    } catch (e) {
      // silently ignore parse errors
    }
  };

  const handleRefreshCode = () => {
    const newCode = generateArduinoCode(elements, displayWidth, displayHeight, backgroundColor);
    setCode(newCode);
    setCodeModified(false);
    setAutoSync(true);
  };

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
            {codeModified && (
              <button
                onClick={handleRefreshCode}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white font-medium"
              >
                ↻ Code aktualisieren
              </button>
            )}
            <label className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4"
              />
              Auto-Sync
            </label>
          </div>
        </header>

        {/* Background Color Panel */}
        <BackgroundColorPanel />

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Preview & Code Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Preview */}
            <div className="flex-1 flex flex-col border-r border-gray-700 overflow-hidden">
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
                <h2 className="text-sm font-semibold">Vorschau</h2>
              </div>
              <Preview />
            </div>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col border-t border-gray-700 overflow-hidden">
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
                <h2 className="text-sm font-semibold">Code Editor</h2>
              </div>
              <Editor code={code} onChange={handleCodeChange} />
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

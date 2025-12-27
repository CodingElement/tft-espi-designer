"use client";

import { useState } from "react";
import Toolbar from "@/components/Toolbar";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import PropertyPanel from "@/components/PropertyPanel";
import DisplaySettings from "@/components/DisplaySettings";
import { useDesignStore } from "@/lib/store";

export default function Home() {
  const [code, setCode] = useState(`// TFT_eSPI Designer Code
#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI();

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
  
  // Dein Design hier
  tft.drawRect(10, 10, 100, 50, TFT_WHITE);
  tft.drawString("TFT Designer", 20, 20, 2);
}

void loop() {
  delay(100);
}
`);

  const { selectedElement } = useDesignStore();

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
          <DisplaySettings />
        </header>

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
              <Editor code={code} onChange={setCode} />
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

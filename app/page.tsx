"use client";

import { useState, useEffect } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import PropertyPanel from "@/components/PropertyPanel";
import BackgroundColorPanel from "@/components/BackgroundColorPanel";
import HelpModal from "@/components/HelpModal";
import { useDesignStore, type DesignElement } from "@/lib/store";
import { generateArduinoCode, parseArduinoCode } from "@/lib/codeGenerator";
import { useResizable } from "@/lib/hooks/useResizable";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";

// Layout-Konstanten
const PROPERTY_PANEL_DEFAULT_WIDTH = 250;
const PROPERTY_PANEL_MIN_WIDTH = 150;
const EDITOR_DEFAULT_WIDTH = 350;
const EDITOR_MIN_WIDTH = 200;
const LAYOUT_MIN_REMAINING_WIDTH = 400;

export default function Home() {
  const [code, setCode] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [codeModified, setCodeModified] = useState(false);
  const [clipboard, setClipboard] = useState<DesignElement | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  
  // Resizable panels using custom hook
  const propertyPanel = useResizable({
    defaultWidth: PROPERTY_PANEL_DEFAULT_WIDTH,
    minWidth: PROPERTY_PANEL_MIN_WIDTH,
    containerSelector: ".main-layout-container",
    maxWidthConstraint: LAYOUT_MIN_REMAINING_WIDTH,
  });
  
  const editorPanel = useResizable({
    defaultWidth: EDITOR_DEFAULT_WIDTH,
    minWidth: EDITOR_MIN_WIDTH,
    containerSelector: ".preview-editor-container",
    resizeFromRight: true,
    maxWidthConstraint: LAYOUT_MIN_REMAINING_WIDTH,
  });
  
  const { elements, selectedElement, displayWidth, displayHeight, backgroundColor } = useDesignStore();

  // Automatisch Code generieren wenn Elemente sich ändern
  useEffect(() => {
    if (autoSync && !codeModified) {
      const newCode = generateArduinoCode(elements, displayWidth, displayHeight, backgroundColor, code);
      setCode(newCode);
    }
  }, [elements, displayWidth, displayHeight, backgroundColor, autoSync, codeModified, code]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setCodeModified(true);
    // Auto-Sync wird automatisch ausgeschaltet wenn User tippt
    setAutoSync(false);

    // Don't auto-parse when user is manually editing code
    // User can use "Code aktualisieren" button to sync back
  };

  const handleRefreshCode = () => {
    const newCode = generateArduinoCode(elements, displayWidth, displayHeight, backgroundColor, code);
    setCode(newCode);
    setCodeModified(false);
    setAutoSync(true);
  };

  // Keyboard shortcuts using custom hook
  useKeyboardShortcuts({
    clipboard,
    onCopy: (element) => {
      // Deep copy to clipboard
      setClipboard(JSON.parse(JSON.stringify(element)));
    },
    onCut: (element) => {
      // Deep copy to clipboard (element deletion handled by hook)
      setClipboard(JSON.parse(JSON.stringify(element)));
    },
    onPaste: (clipboardElement) => {
      const store = useDesignStore.getState();
      const newEl: DesignElement = {
        ...clipboardElement,
        id: `el_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        x: Math.min(clipboardElement.x + 10, store.displayWidth - 5),
        y: Math.min(clipboardElement.y + 10, store.displayHeight - 5),
      };
      store.addElement(newEl);
      store.selectElement(newEl.id);
    },
  });

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Removed Toolbar - now integrated into Preview section */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">TFT-eSPI Designer</h1>
            <p className="text-sm text-gray-400">Online Editor mit Live-Vorschau</p>
          </div>
          <div className="absolute right-6 flex items-center gap-4">
            {codeModified && (
              <button
                onClick={handleRefreshCode}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white font-medium"
              >
                ↻ Code aktualisieren
              </button>
            )}
          </div>
        </header>

        {/* Background Color Panel */}
        <BackgroundColorPanel />

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden main-layout-container">
          {/* Property Panel (left, always visible) */}
          <div className="border-r border-gray-700 bg-gray-800" style={{ width: `${propertyPanel.width}px` }}>
            <PropertyPanel />
          </div>

          {/* Vertical Divider (left of preview) */}
          <div
            className="w-1 bg-gray-600 hover:bg-blue-500 cursor-col-resize transition-colors"
            onMouseDown={propertyPanel.startResizing}
          />

          {/* Preview & Code Editor (horizontal) */}
          <div className="flex-1 flex overflow-hidden preview-editor-container">
            {/* Preview */}
            <div className="flex flex-col border-r border-gray-700 overflow-hidden" style={{ flex: "1 1 auto" }}>
              <Preview onOpenHelp={() => setHelpOpen(true)} />
            </div>

            {/* Vertical Divider (between Preview & Code Editor) */}
            <div
              className="w-1 bg-gray-600 hover:bg-blue-500 cursor-col-resize transition-colors"
              onMouseDown={editorPanel.startResizing}
            />

            {/* Code Editor */}
            <div className="flex flex-col border-r border-gray-700 overflow-hidden" style={{ width: `${editorPanel.width}px` }}>
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-gray-300 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="w-3 h-3"
                    />
                    Auto-Sync
                  </label>
                  <h2 className="text-sm font-semibold">Code Editor</h2>
                </div>
              </div>
              <Editor code={code} onChange={handleCodeChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

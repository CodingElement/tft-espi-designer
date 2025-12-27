"use client";

import { useState, useEffect } from "react";
import Toolbar from "@/components/Toolbar";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import PropertyPanel from "@/components/PropertyPanel";
import DisplaySettings from "@/components/DisplaySettings";
import BackgroundColorPanel from "@/components/BackgroundColorPanel";
import { useDesignStore, type DesignElement } from "@/lib/store";
import { generateArduinoCode, parseArduinoCode } from "@/lib/codeGenerator";

export default function Home() {
  const [code, setCode] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [codeModified, setCodeModified] = useState(false);
  const [clipboard, setClipboard] = useState<DesignElement | null>(null);
  const [editorHeight, setEditorHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
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

  // Keyboard shortcuts: Delete, Copy (Ctrl+C), Cut (Ctrl+X), Paste (Ctrl+V)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Avoid interfering with inputs, textareas, contentEditable, or Monaco editor
      if (target) {
        const isTextField = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || (target as any).isContentEditable;
        const inMonaco = !!target.closest?.(".monaco-editor");
        if (isTextField || inMonaco) return;
      }

      const store = useDesignStore.getState();
      const sel = store.selectedElement;

      // Delete key removes selected element
      if (e.key === "Delete" && sel) {
        e.preventDefault();
        store.deleteElement(sel.id);
        return;
      }

      // Copy / Cut / Paste
      if (e.ctrlKey) {
        if (e.key.toLowerCase() === "c" && sel) {
          e.preventDefault();
          // Deep copy selected element to clipboard
          setClipboard(JSON.parse(JSON.stringify(sel)));
          return;
        }
        if (e.key.toLowerCase() === "x" && sel) {
          e.preventDefault();
          setClipboard(JSON.parse(JSON.stringify(sel)));
          store.deleteElement(sel.id);
          return;
        }
        if (e.key.toLowerCase() === "v" && clipboard) {
          e.preventDefault();
          const base = clipboard;
          const newEl: DesignElement = {
            ...base,
            id: `el_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            x: Math.min(base.x + 10, store.displayWidth - 5),
            y: Math.min(base.y + 10, store.displayHeight - 5),
          };
          store.addElement(newEl);
          store.selectElement(newEl.id);
          return;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clipboard]);

  // Handle editor height resize
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const container = document.querySelector(".preview-editor-container") as HTMLElement;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const newEditorHeight = Math.max(100, Math.min(e.clientY - containerRect.top - 5, containerRect.height - 100));
      setEditorHeight(newEditorHeight);
    };

    const onMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [isResizing]);

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
          <div className="flex-1 flex flex-col overflow-hidden preview-editor-container">
            {/* Preview */}
            <div className="flex-1 flex flex-col border-r border-gray-700 overflow-hidden">
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
                <h2 className="text-sm font-semibold">Vorschau</h2>
              </div>
              <Preview />
            </div>

            {/* Resizable Divider */}
            <div
              className="h-1 bg-gray-600 hover:bg-blue-500 cursor-row-resize transition-colors"
              onMouseDown={() => setIsResizing(true)}
            />

            {/* Code Editor */}
            <div className="flex flex-col border-t border-gray-700 overflow-hidden" style={{ height: `${editorHeight}px` }}>
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

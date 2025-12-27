"use client";

import { useDesignStore } from "@/lib/store";
import ColorPicker from "./ColorPicker";

export default function PropertyPanel() {
  const { selectedElement, updateElement, deleteElement } = useDesignStore();

  if (!selectedElement) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-gray-800">
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-semibold text-sm mb-4">Eigenschaften</h3>
        </div>
        <div className="flex items-center justify-center h-full p-6 text-center text-gray-400 text-sm">
          Erstelle ein Objekt oder wähle eines aus
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-800">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold text-sm mb-4">Eigenschaften</h3>

        {/* Position */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs text-gray-400">X</label>
            <input
              type="number"
              value={selectedElement.x}
              onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Y</label>
            <input
              type="number"
              value={selectedElement.y}
              onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
            />
          </div>
        </div>

        {/* Kreis: Radius direkt nach Position */}
        {selectedElement.type === "circle" && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs text-gray-400">Radius</label>
              <input
                type="number"
                value={selectedElement.radius || 10}
                onChange={(e) => {
                  const radius = parseInt(e.target.value);
                  updateElement(selectedElement.id, { 
                    radius,
                    width: radius * 2,
                    height: radius * 2
                  });
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
              />
            </div>
          </div>
        )}

        {/* Größe (für alle außer Kreis und Text) */}
        {selectedElement.type !== "circle" && selectedElement.type !== "text" && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs text-gray-400">Breite</label>
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Höhe</label>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
              />
            </div>
          </div>
        )}

        {/* Farbe */}
        <div className="space-y-3 mb-4">
          <ColorPicker
            value={selectedElement.color}
            onChange={(color) => updateElement(selectedElement.id, { color })}
            label="Farbe"
          />
        </div>

        {/* Text-spezifische Eigenschaften */}
        {(selectedElement.type === "text" || selectedElement.type === "button") && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs text-gray-400">Text</label>
              <input
                type="text"
                value={selectedElement.text || ""}
                onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Schriftgröße</label>
              <input
                type="number"
                value={selectedElement.fontSize || 16}
                onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
              />
            </div>
          </div>
        )}

        {/* Rahmen */}
        {(selectedElement.type === "rect" || selectedElement.type === "circle" || selectedElement.type === "triangle" || selectedElement.type === "button") && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400">Rahmenbreite</label>
              <input
                type="number"
                value={selectedElement.borderWidth || 0}
                onChange={(e) => updateElement(selectedElement.id, { borderWidth: parseInt(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
              />
            </div>
            <div>
              <ColorPicker
                value={selectedElement.borderColor || "#FFFFFF"}
                onChange={(color) => updateElement(selectedElement.id, { borderColor: color })}
                label="Rahmenfarbe"
              />
            </div>
          </div>
        )}
      </div>
      {/* Aktionen */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => selectedElement && deleteElement(selectedElement.id)}
          className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm text-white font-medium"
        >
          Element löschen
        </button>
      </div>
    </div>
  );
}

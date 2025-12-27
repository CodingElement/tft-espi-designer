"use client";

import { useDesignStore, type ElementType } from "@/lib/store";
import {
  Square,
  Circle,
  Type,
  Minus,
  Trash2,
  Copy,
  RotateCcw,
  Triangle,
} from "lucide-react";
import { useState } from "react";

const ELEMENT_TYPES: { type: ElementType; icon: React.ReactNode; label: string }[] = [
  { type: "rect", icon: <Square size={20} />, label: "Rechteck" },
  { type: "circle", icon: <Circle size={20} />, label: "Kreis" },
  { type: "triangle", icon: <Triangle size={20} />, label: "Dreieck" },
  { type: "text", icon: <Type size={20} />, label: "Text" },
  { type: "line", icon: <Minus size={20} />, label: "Linie" },
];

export default function Toolbar() {
  const { addElement, clearAll, deleteElement, selectedElement } = useDesignStore();
  const [nextId, setNextId] = useState(0);

  const handleAddElement = (type: ElementType) => {
    const element = {
      id: `element-${nextId}`,
      type,
      x: 50 + nextId * 10,
      y: 50 + nextId * 10,
      width: type === "circle" || type === "text" ? 50 : 100,
      height: type === "circle" ? 50 : type === "text" ? 30 : 60,
      color: "#ffffff",
      text: type === "text" ? "Text" : type === "button" ? "Button" : undefined,
      fontSize: type === "text" ? 16 : undefined,
      radius: type === "circle" ? 25 : undefined,
      borderWidth: 0,
    };

    addElement(element);
    setNextId(nextId + 1);
  };

  return (
    <div className="w-20 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-4">
      {/* Elements */}
      <div className="flex flex-col gap-2 w-full px-2">
        {ELEMENT_TYPES.map(({ type, icon, label }) => (
          <button
            key={type}
            onClick={() => handleAddElement(type)}
            title={label}
            className="p-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-700" />

      {/* Actions */}
      <div className="flex flex-col gap-2 w-full px-2 mt-auto">
        {selectedElement && (
          <button
            onClick={() => deleteElement(selectedElement.id)}
            title="Löschen"
            className="p-3 rounded-lg hover:bg-red-900 transition-colors text-red-400 hover:text-red-300"
          >
            <Trash2 size={20} />
          </button>
        )}

        <button
          onClick={() => clearAll()}
          title="Alles löschen"
          className="p-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-200"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}

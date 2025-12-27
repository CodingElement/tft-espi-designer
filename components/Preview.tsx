"use client";

import { useEffect, useRef, useState } from "react";
import { useDesignStore, type DesignElement, type ElementType } from "@/lib/store";
import { Square, Circle, Type, Minus, Trash2, Trash, Triangle, Undo2, Redo2, HelpCircle } from "lucide-react";

const ELEMENT_TYPES: { type: ElementType; icon: React.ReactNode; label: string }[] = [
  { type: "rect", icon: <Square size={18} />, label: "Rechteck" },
  { type: "circle", icon: <Circle size={18} />, label: "Kreis" },
  { type: "triangle", icon: <Triangle size={18} />, label: "Dreieck" },
  { type: "text", icon: <Type size={18} />, label: "Text" },
  { type: "line", icon: <Minus size={18} />, label: "Linie" },
];

const PRESET_SIZES = [
  { name: "2.4\" ILI9341", width: 320, height: 240 },
  { name: "3.5\" ILI9486", width: 480, height: 320 },
  { name: "4.0\" ILI9488", width: 480, height: 320 },
  { name: "5.0\" ILI9488", width: 800, height: 480 },
  { name: "7.0\" Nextion", width: 800, height: 480 },
  { name: "Custom", width: 0, height: 0 },
];

interface PreviewProps {
  onOpenHelp: () => void;
}

export default function Preview({ onOpenHelp }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { elements, selectElement, updateElement, displayWidth, displayHeight, backgroundColor, previewScale, addElement, deleteElement, clearAll, selectedElement, undo, redo, canUndo, canRedo } = useDesignStore();
  const [nextId, setNextId] = useState(0);
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState<string>("default");
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customWidth, setCustomWidth] = useState(displayWidth);
  const [customHeight, setCustomHeight] = useState(displayHeight);

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

  // Helper: Render text with character-by-character wrapping (like TFT_eSPI)
  // Returns rendered dimensions { width, height }
  const renderTextWithWrapping = (
    ctx: CanvasRenderingContext2D, 
    el: DesignElement, 
    drawText: boolean = true
  ): { width: number; height: number } => {
    const text = el.text || "Text";
    const fontSize = el.fontSize || 16;
    ctx.font = `${fontSize}px Arial`;
    
    let currentX = el.x;
    let currentY = el.y;
    let currentLineWidth = 0;
    let maxWidth = 0;
    let lineCount = 1;
    
    // Process character by character
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charWidth = ctx.measureText(char).width;
      
      // Check if character would exceed display width
      if (currentX + charWidth > displayWidth) {
        // Save max width before wrapping
        maxWidth = Math.max(maxWidth, currentLineWidth);
        // Wrap to next line at x=0
        currentX = 0;
        currentY += fontSize;
        currentLineWidth = 0;
        lineCount++;
      }
      
      // Draw the character if requested
      if (drawText) {
        ctx.fillText(char, currentX, currentY + fontSize);
      }
      
      // Move cursor for next character
      currentX += charWidth;
      currentLineWidth += charWidth;
    }
    
    // Final line width
    maxWidth = Math.max(maxWidth, currentLineWidth);
    
    return {
      width: Math.max(maxWidth, 10),
      height: lineCount * fontSize
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure crisp pixel rendering
    // @ts-ignore
    ctx.imageSmoothingEnabled = false;

    // Clear canvas mit Hintergrundfarbe
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Draw all elements and update text dimensions
    elements.forEach((el) => {
      drawElement(ctx, el);
      
      // Update text element dimensions based on actual rendered size
      if (el.type === "text") {
        const { width, height } = renderTextWithWrapping(ctx, el, false);
        if (el.width !== width || el.height !== height) {
          updateElement(el.id, { width, height });
        }
      }
    });
  }, [elements, displayWidth, displayHeight, backgroundColor]);

  function drawElement(ctx: CanvasRenderingContext2D, el: DesignElement) {
    switch (el.type) {
      case "rect":
        ctx.fillStyle = el.color;
        ctx.fillRect(el.x, el.y, el.width, el.height);
        if (el.borderWidth && el.borderWidth > 0) {
          ctx.strokeStyle = el.borderColor || "#ffffff";
          ctx.lineWidth = el.borderWidth;
          ctx.strokeRect(el.x, el.y, el.width, el.height);
        }
        break;

      case "circle":
        ctx.fillStyle = el.color;
        ctx.beginPath();
        ctx.arc(el.x + el.width / 2, el.y + el.height / 2, el.radius || 10, 0, Math.PI * 2);
        ctx.fill();
        if (el.borderWidth && el.borderWidth > 0) {
          ctx.strokeStyle = el.borderColor || "#ffffff";
          ctx.lineWidth = el.borderWidth;
          ctx.stroke();
        }
        break;

      case "triangle":
        ctx.fillStyle = el.color;
        ctx.beginPath();
        ctx.moveTo(el.x + el.width / 2, el.y); // Oben
        ctx.lineTo(el.x + el.width, el.y + el.height); // Unten rechts
        ctx.lineTo(el.x, el.y + el.height); // Unten links
        ctx.closePath();
        ctx.fill();
        if (el.borderWidth && el.borderWidth > 0) {
          ctx.strokeStyle = el.borderColor || "#ffffff";
          ctx.lineWidth = el.borderWidth;
          ctx.stroke();
        }
        break;

      case "text":
        ctx.fillStyle = el.color;
        // Use unified text rendering function
        renderTextWithWrapping(ctx, el, true);
        break;

      case "line":
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.borderWidth || 1;
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(el.x + el.width, el.y + el.height);
        ctx.stroke();
        break;

      case "button":
        ctx.fillStyle = el.backgroundColor || el.color;
        ctx.fillRect(el.x, el.y, el.width, el.height);
        ctx.strokeStyle = el.borderColor || "#ffffff";
        ctx.lineWidth = el.borderWidth || 2;
        ctx.strokeRect(el.x, el.y, el.width, el.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${el.fontSize || 14}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.text || "Button", el.x + el.width / 2, el.y + el.height / 2);
        ctx.textAlign = "left";
        break;

      case "image":
        ctx.fillStyle = "#333333";
        ctx.fillRect(el.x, el.y, el.width, el.height);
        ctx.strokeStyle = "#666666";
        ctx.lineWidth = 1;
        ctx.strokeRect(el.x, el.y, el.width, el.height);
        ctx.fillStyle = "#999999";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Image", el.x + el.width / 2, el.y + el.height / 2 - 6);
        ctx.font = "10px Arial";
        ctx.fillStyle = "#666666";
        ctx.fillText(`${el.width}x${el.height}`, el.x + el.width / 2, el.y + el.height / 2 + 6);
        ctx.textAlign = "left";
        break;
    }
  }

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const getElementAtCoordinates = (x: number, y: number): DesignElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height) {
        return el;
      }
    }
    return null;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    const element = getElementAtCoordinates(coords.x, coords.y);

    if (element) {
      selectElement(element.id);
      setDraggingElement(element.id);
      setDragOffset({
        x: coords.x - element.x,
        y: coords.y - element.y,
      });
    } else {
      // Deselect when clicking on empty canvas background
      selectElement(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    const element = getElementAtCoordinates(coords.x, coords.y);

    // Update cursor based on whether hovering over an element
    if (draggingElement) {
      setCursorStyle("move");
    } else if (element) {
      setCursorStyle("move");
    } else {
      setCursorStyle("default");
    }

    if (!draggingElement) return;

    const newX = Math.max(0, Math.min(coords.x - dragOffset.x, displayWidth - 10));
    const newY = Math.max(0, Math.min(coords.y - dragOffset.y, displayHeight - 10));

    updateElement(draggingElement, {
      x: newX,
      y: newY,
    });
  };

  const handleCanvasMouseUp = () => {
    setDraggingElement(null);
  };

  const handleClearAll = () => {
    if (window.confirm("Möchtest du wirklich alle Elemente löschen?")) {
      clearAll();
    }
  };

  const currentPreset = PRESET_SIZES.find(
    (p) => p.width === displayWidth && p.height === displayHeight
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between gap-4">
        {/* Left: Display & Zoom */}
        <div className="flex items-center gap-3">
          <select
            value={currentPreset?.name || "Custom"}
            onChange={(e) => {
              const preset = PRESET_SIZES.find((p) => p.name === e.target.value);
              if (preset) {
                if (preset.name === "Custom") {
                  setShowCustomDialog(true);
                } else {
                  useDesignStore.getState().setDisplaySize(preset.width, preset.height);
                }
              }
            }}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white cursor-pointer hover:bg-gray-600"
            title="Display-Größe"
          >
            {PRESET_SIZES.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Zoom:</span>
            <select
              value={previewScale.toString()}
              onChange={(e) => {
                const scale = parseFloat(e.target.value);
                useDesignStore.getState().setPreviewScale(scale);
              }}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white cursor-pointer hover:bg-gray-600"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
              <option value="3">3x</option>
              <option value="4">4x</option>
            </select>
          </div>
        </div>
        
        {/* Center: Element Tools */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {ELEMENT_TYPES.map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => handleAddElement(type)}
                title={label}
                className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
              >
                {icon}
              </button>
            ))}
          </div>
          
          <div className="w-px h-6 bg-gray-700" />
          
          {/* Undo/Redo */}
          <button
            onClick={() => undo()}
            disabled={!canUndo()}
            title="Rückgängig (Ctrl+Z)"
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={() => redo()}
            disabled={!canRedo()}
            title="Wiederherstellen (Ctrl+Y)"
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Redo2 size={18} />
          </button>
          
          <div className="w-px h-6 bg-gray-700" />
          
          {selectedElement && (
            <button
              onClick={() => deleteElement(selectedElement.id)}
              title="Löschen"
              className="p-2 rounded hover:bg-red-900 transition-colors text-red-400 hover:text-red-300"
            >
              <Trash2 size={18} />
            </button>
          )}
          
          <button
            onClick={handleClearAll}
            title="Alles löschen"
            className="p-2 rounded hover:bg-red-900 transition-colors text-red-400 hover:text-red-300"
          >
            <Trash size={18} />
          </button>
        </div>
        
        {/* Right: Help */}
        <button
          onClick={onOpenHelp}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          aria-label="Hilfe"
          title="Hilfe & Anleitung"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-950 p-8">
        <div className="relative bg-black border-2 border-gray-700 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={displayWidth}
            height={displayHeight}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className={cursorStyle === "move" ? "cursor-move" : "cursor-default"}
            style={{
              width: `${displayWidth * previewScale}px`,
              height: `${displayHeight * previewScale}px`,
              imageRendering: "pixelated",
            }}
          />
        </div>
      </div>

      {/* Custom Display Size Dialog */}
      {showCustomDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Custom Display-Größe</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Breite (px)</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                  min="1"
                  max="2000"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Höhe (px)</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                  min="1"
                  max="2000"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCustomDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  useDesignStore.getState().setDisplaySize(customWidth, customHeight);
                  setShowCustomDialog(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
              >
                Übernehmen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


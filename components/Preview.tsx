"use client";

import { useEffect, useRef } from "react";
import { useDesignStore, type DesignElement } from "@/lib/store";

export default function Preview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { elements, selectElement, displayWidth, displayHeight } = useDesignStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Draw all elements
    elements.forEach((el) => drawElement(ctx, el));
  }, [elements, displayWidth, displayHeight]);

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

      case "text":
        ctx.fillStyle = el.color;
        ctx.font = `${el.fontSize || 16}px Arial`;
        ctx.fillText(el.text || "Text", el.x, el.y + (el.fontSize || 16));
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked element (from top to bottom)
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height) {
        selectElement(el.id);
        return;
      }
    }

    selectElement(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-950 p-8">
      <div className="relative bg-black border-2 border-gray-700 shadow-2xl" style={{ aspectRatio: `${displayWidth}/${displayHeight}` }}>
        <canvas
          ref={canvasRef}
          width={displayWidth}
          height={displayHeight}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-pointer"
          style={{ imageRendering: "crisp-edges" }}
        />
      </div>
    </div>
  );
}

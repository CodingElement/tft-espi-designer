import { DesignElement } from "./store";

export function generateArduinoCode(elements: DesignElement[], displayWidth: number = 320, displayHeight: number = 240): string {
  let code = `#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI();

void setup() {
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
  
`;

  // Generate drawing code for each element
  elements.forEach((el) => {
    code += generateElementCode(el);
  });

  code += `}

void loop() {
  delay(100);
}
`;

  return code;
}

function generateElementCode(el: DesignElement): string {
  const color = colorToHex(el.color);
  let code = "  ";

  switch (el.type) {
    case "rect":
      if (el.borderWidth && el.borderWidth > 0) {
        code += `tft.drawRect(${el.x}, ${el.y}, ${el.width}, ${el.height}, ${color});`;
      } else {
        code += `tft.fillRect(${el.x}, ${el.y}, ${el.width}, ${el.height}, ${color});`;
      }
      break;

    case "circle":
      if (el.borderWidth && el.borderWidth > 0) {
        code += `tft.drawCircle(${el.x + (el.radius || 10)}, ${el.y + (el.radius || 10)}, ${el.radius || 10}, ${color});`;
      } else {
        code += `tft.fillCircle(${el.x + (el.radius || 10)}, ${el.y + (el.radius || 10)}, ${el.radius || 10}, ${color});`;
      }
      break;

    case "text":
      code += `tft.setTextColor(${color});
  tft.drawString("${el.text || "Text"}", ${el.x}, ${el.y}, ${el.fontSize || 2});`;
      break;

    case "line":
      code += `tft.drawLine(${el.x}, ${el.y}, ${el.x + el.width}, ${el.y + el.height}, ${color});`;
      break;

    case "button":
      code += `tft.fillRect(${el.x}, ${el.y}, ${el.width}, ${el.height}, ${color});
  tft.setTextColor(TFT_WHITE);
  tft.drawString("${el.text || "Button"}", ${el.x + 10}, ${el.y + (el.height / 2 - 8)}, 2);`;
      break;

    case "image":
      code += `// Image at (${el.x}, ${el.y}) - size: ${el.width}x${el.height}`;
      break;
  }

  return code + "\n";
}

function colorToHex(color: string): string {
  // Convert color name or hex to TFT_eSPI color constant
  const colorMap: { [key: string]: string } = {
    "#000000": "TFT_BLACK",
    "#FFFFFF": "TFT_WHITE",
    "#FF0000": "TFT_RED",
    "#00FF00": "TFT_GREEN",
    "#0000FF": "TFT_BLUE",
    "#FFFF00": "TFT_YELLOW",
    "#FF00FF": "TFT_MAGENTA",
    "#00FFFF": "TFT_CYAN",
  };

  return colorMap[color.toUpperCase()] || `0x${color.slice(1).toUpperCase()}`;
}

export function extractTFTElements(code: string): string[] {
  const regex = /tft\.(draw|fill)(Rect|Circle|Line|String)/g;
  const matches = code.match(regex) || [];
  return [...new Set(matches)];
}

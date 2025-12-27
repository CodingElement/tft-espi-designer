import { DesignElement } from "./store";

export function generateArduinoCode(elements: DesignElement[], displayWidth: number = 320, displayHeight: number = 240, backgroundColor: string = "#000000", existingCode?: string): string {
  // Extract custom code sections from existing code
  let customCode = "";
  let setupPrefix = "  tft.init();\n  tft.setRotation(1);\n  tft.fillScreen(" + colorToHex(backgroundColor) + ");\n  \n";
  let setupSuffix = "";
  let loopCode = "\n  delay(100);\n";
  
  if (existingCode) {
    // Extract custom functions/variables (between CUSTOM CODE markers)
    const customMatch = existingCode.match(/\/\/ CUSTOM CODE START([\s\S]*?)\/\/ CUSTOM CODE END/);
    if (customMatch) {
      customCode = customMatch[1];
    }
    
    // Extract setup prefix (before DRAWING CODE START)
    const setupPrefixMatch = existingCode.match(/void setup\(\)\s*\{([\s\S]*?)\/\/ DRAWING CODE START/);
    if (setupPrefixMatch) {
      setupPrefix = setupPrefixMatch[1];
    }
    
    // Extract setup suffix (after DRAWING CODE END, until end of setup function)
    const setupSuffixMatch = existingCode.match(/\/\/ DRAWING CODE END\n([\s\S]*?)\n\}\n\nvoid loop/);
    if (setupSuffixMatch) {
      setupSuffix = "\n" + setupSuffixMatch[1] + "\n";
    }
    
    // Extract loop content
    const loopMatch = existingCode.match(/void loop\(\)\s*\{([\s\S]*?)\}\s*$/);
    if (loopMatch) {
      loopCode = loopMatch[1];
    }
  }

  let code = `#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI();

// CUSTOM CODE START${customCode}// CUSTOM CODE END

void setup() {
${setupPrefix}  // DRAWING CODE START
`;

  // Generate drawing code for each element
  elements.forEach((el) => {
    code += generateElementCode(el);
  });

  code += `  // DRAWING CODE END${setupSuffix}}

void loop() {${loopCode}}
`;

  return code;
}

// Parse TFT_eSPI Arduino code into design elements and background color
export function parseArduinoCode(code: string): { elements: DesignElement[]; backgroundColor?: string } {
  const elements: DesignElement[] = [];
  let bgColorHex: string | undefined = undefined;

  // Background color: tft.fillScreen(COLOR)
  const fillScreenMatch = code.match(/tft\.fillScreen\(([^)]+)\)/);
  if (fillScreenMatch) {
    const cToken = fillScreenMatch[1].trim();
    bgColorHex = tftColorTokenToHex(cToken);
  }

  // Rectangles
  const rectRegex = /tft\.(fillRect|drawRect)\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([^)]+)\)/g;
  for (const m of code.matchAll(rectRegex)) {
    const [, kind, x, y, w, h, cToken] = m;
    const color = tftColorTokenToHex(cToken.trim());
    elements.push({
      id: `el-${elements.length}`,
      type: "rect",
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      width: parseInt(w, 10),
      height: parseInt(h, 10),
      color,
      borderWidth: kind === "drawRect" ? 1 : 0,
    });
  }

  // Circles
  const circRegex = /tft\.(fillCircle|drawCircle)\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([^)]+)\)/g;
  for (const m of code.matchAll(circRegex)) {
    const [, kind, cx, cy, r, cToken] = m;
    const color = tftColorTokenToHex(cToken.trim());
    const radius = parseInt(r, 10);
    const x = parseInt(cx, 10) - radius;
    const y = parseInt(cy, 10) - radius;
    elements.push({
      id: `el-${elements.length}`,
      type: "circle",
      x,
      y,
      width: radius * 2,
      height: radius * 2,
      radius,
      color,
      borderWidth: kind === "drawCircle" ? 1 : 0,
    });
  }

  // Lines
  const lineRegex = /tft\.drawLine\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([^)]+)\)/g;
  for (const m of code.matchAll(lineRegex)) {
    const [, x1, y1, x2, y2, cToken] = m;
    const color = tftColorTokenToHex(cToken.trim());
    elements.push({
      id: `el-${elements.length}`,
      type: "line",
      x: parseInt(x1, 10),
      y: parseInt(y1, 10),
      width: parseInt(x2, 10) - parseInt(x1, 10),
      height: parseInt(y2, 10) - parseInt(y1, 10),
      color,
      borderWidth: 1,
    });
  }

  // Text: use last setTextColor before drawString if available
  let lastTextColor: string | undefined = undefined;
  const textColorRegex = /tft\.setTextColor\(([^)]+)\)/g;
  for (const m of code.matchAll(textColorRegex)) {
    lastTextColor = tftColorTokenToHex(m[1].trim());
  }
  const textRegex = /tft\.drawString\(\s*"([\s\S]*?)"\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g;
  for (const m of code.matchAll(textRegex)) {
    const [, text, x, y, font] = m;
    elements.push({
      id: `el-${elements.length}`,
      type: "text",
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      width: text.length * 8,
      height: (parseInt(font, 10) || 2) * 8,
      text,
      color: lastTextColor || "#FFFFFF",
      fontSize: parseInt(font, 10) || 2,
    });
  }

  return { elements, backgroundColor: bgColorHex };
}

// Convert TFT color token (TFT_RED or 0xF800) to #RRGGBB
export function tftColorTokenToHex(token: string): string {
  const namedMap: Record<string, string> = {
    TFT_BLACK: "#000000",
    TFT_WHITE: "#FFFFFF",
    TFT_RED: "#FF0000",
    TFT_GREEN: "#00FF00",
    TFT_BLUE: "#0000FF",
    TFT_YELLOW: "#FFFF00",
    TFT_MAGENTA: "#FF00FF",
    TFT_CYAN: "#00FFFF",
  };
  const upper = token.toUpperCase();
  if (namedMap[upper]) return namedMap[upper];
  // 0xRGB565
  const m = upper.match(/^0X([0-9A-F]{4})$/);
  if (m) {
    const v = parseInt(m[1], 16);
    const r5 = (v >> 11) & 0x1f;
    const g6 = (v >> 5) & 0x3f;
    const b5 = v & 0x1f;
    const r8 = (r5 << 3) | (r5 >> 2);
    const g8 = (g6 << 2) | (g6 >> 4);
    const b8 = (b5 << 3) | (b5 >> 2);
    const hex = `#${r8.toString(16).padStart(2, "0")}${g8.toString(16).padStart(2, "0")}${b8.toString(16).padStart(2, "0")}`.toUpperCase();
    return hex;
  }
  // Fallback: if already #RRGGBB
  if (upper.startsWith("#") && upper.length === 7) return upper;
  return "#FFFFFF";
}
function generateElementCode(el: DesignElement): string {
  const fillColor = colorToHex(el.color);
  const strokeColor = colorToHex(el.borderColor || el.color);
  let code = "  ";

  switch (el.type) {
    case "rect":
      // Always fill first
      code += `tft.fillRect(${el.x}, ${el.y}, ${el.width}, ${el.height}, ${fillColor});`;
      // Then draw border if requested
      if (el.borderWidth && el.borderWidth > 0) {
        if (el.borderWidth === 1) {
          code += `\n  tft.drawRect(${el.x}, ${el.y}, ${el.width}, ${el.height}, ${strokeColor});`;
        } else {
          code += `\n  // Simulated border thickness: ${el.borderWidth}`;
          code += `\n  for (int i = 0; i < ${el.borderWidth}; i++) {`;
          code += `\n    tft.drawRect(${el.x} + i, ${el.y} + i, ${el.width} - 2*i, ${el.height} - 2*i, ${strokeColor});`;
          code += `\n  }`;
        }
      }
      break;

    case "triangle":
      code += `// Triangle at (${el.x}, ${el.y}) - size: ${el.width}x${el.height}`;
      code += `\n  tft.fillTriangle(${el.x + el.width / 2}, ${el.y}, ${el.x + el.width}, ${el.y + el.height}, ${el.x}, ${el.y + el.height}, ${fillColor});`;
      if (el.borderWidth && el.borderWidth > 0) {
        code += `\n  // TFT_eSPI does not support stroke width for triangles; drawing outline once`;
        code += `\n  tft.drawTriangle(${el.x + el.width / 2}, ${el.y}, ${el.x + el.width}, ${el.y + el.height}, ${el.x}, ${el.y + el.height}, ${strokeColor});`;
      }
      break;

    case "circle":
      const cx = el.x + (el.radius || 10);
      const cy = el.y + (el.radius || 10);
      const r = el.radius || 10;
      code += `tft.fillCircle(${cx}, ${cy}, ${r}, ${fillColor});`;
      if (el.borderWidth && el.borderWidth > 0) {
        if (el.borderWidth === 1) {
          code += `\n  tft.drawCircle(${cx}, ${cy}, ${r}, ${strokeColor});`;
        } else {
          code += `\n  // Simulated border thickness: ${el.borderWidth}`;
          code += `\n  for (int i = 0; i < ${el.borderWidth}; i++) {`;
          code += `\n    tft.drawCircle(${cx}, ${cy}, ${r} - i, ${strokeColor});`;
          code += `\n  }`;
        }
      }
      break;

    case "text":
      code += `tft.setTextColor(${fillColor});
  tft.drawString("${el.text || "Text"}", ${el.x}, ${el.y}, ${el.fontSize || 2});`;
      break;

    case "line":
      // TFT_eSPI line thickness is fixed; use color as stroke
      code += `tft.drawLine(${el.x}, ${el.y}, ${el.x + el.width}, ${el.y + el.height}, ${strokeColor});`;
      break;

    case "button":
      code += `tft.fillRect(${el.x}, ${el.y}, ${el.width}, ${el.height}, ${fillColor});`;
      // Draw border if present (simulate thickness by multiple rects)
      if (el.borderWidth && el.borderWidth > 0) {
        if (el.borderWidth === 1) {
          code += `\n  tft.drawRect(${el.x}, ${el.y}, ${el.width}, ${el.height}, ${strokeColor});`;
        } else {
          code += `\n  // Simulated border thickness: ${el.borderWidth}`;
          code += `\n  for (int i = 0; i < ${el.borderWidth}; i++) {`;
          code += `\n    tft.drawRect(${el.x} + i, ${el.y} + i, ${el.width} - 2*i, ${el.height} - 2*i, ${strokeColor});`;
          code += `\n  }`;
        }
      }
        code += `\n  tft.setTextColor(TFT_WHITE);`;
        code += `\n  tft.drawString("${el.text || "Button"}", ${el.x + 10}, ${el.y + (el.height / 2 - 8)}, 2);`;
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

# TFT-eSPI Designer

Ein modernes Web-basiertes **Designer-Tool** für die TFT-eSPI Bibliothek mit Live-Vorschau und integriertem Code-Editor.

## 📋 Inhaltsverzeichnis

- [Features](#features)
- [Schnellstart](#schnellstart)
- [Installation](#installation)
- [Verwendung](#verwendung)
- [Architektur](#architektur)
- [Technologie Stack](#technologie-stack)

## ✨ Features

### Designer-Funktionalität
- 🎨 **Designelemente**: Rechtecke, Kreise, Text, Linien und Buttons
- 🖱️ **Interaktive Vorschau**: Click-basierte Elementauswahl
- 📐 **Eigenschaften-Panel**: Echtzeit-Anpassung von Position, Größe und Farbe
- 🎯 **TFT Display Simulation**: Realistisches 320x240 Preview

### Code-Integration
- 💻 **Monaco Editor**: Professioneller Code-Editor mit C++ Syntax-Highlighting
- 📦 **Code-Generator**: Automatische Arduino-Code-Generierung (in Vorbereitung)
- 🔗 **Code-Analyse**: Erkennung von TFT_eSPI Funktionen

### Benutzerfreundlichkeit
- 🌙 **Dark Mode**: Professionelle dunkle Oberfläche
- ⌨️ **Tastaturunterstützung**: Intuitive Keyboard-Shortcuts
- 📱 **Responsive**: Optimiert für verschiedene Bildschirmgrößen

## 🚀 Schnellstart

### Voraussetzungen
- Node.js 18+ und npm

### Installation

```bash
# Repository klonen
git clone https://github.com/yourusername/tft-espi-designer.git
cd tft-espi-designer

# Abhängigkeiten installieren
npm install

# Development-Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Build für Production

```bash
npm run build
npm start
```

## 📖 Verwendung

### 1. Elemente hinzufügen
- Klicke auf die Icons in der **linken Toolbar**
- Wähle: Rechteck, Kreis, Text oder Linie
- Elemente werden mit Standard-Positionen hinzugefügt

### 2. Elemente anpassen
- Klicke auf ein Element in der **Vorschau**
- Nutze das **Eigenschaften-Panel** rechts
- Ändere Position (X, Y), Größe, Farbe und weitere Optionen

### 3. Code schreiben/anpassen
- Nutze den **Code-Editor** für Arduino/TFT_eSPI Code
- Schreibe direkten Code oder verwende Auto-Generated Code
- Editor unterstützt C++ Syntax-Highlighting

### 4. Code exportieren
- Kopiere den Code aus dem Editor
- Nutze ihn direkt in der Arduino IDE mit TFT_eSPI Bibliothek

## 🏗️ Architektur

### Verzeichnisstruktur

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root Layout
│   ├── page.tsx                 # Main Page
│   └── globals.css              # Global Styles
│
├── components/                   # React Komponenten
│   ├── Editor.tsx               # Monaco Code Editor
│   ├── Preview.tsx              # Canvas-basierte Vorschau
│   ├── Toolbar.tsx              # Element-Toolbar
│   ├── PropertyPanel.tsx         # Eigenschaften-Editor
│   └── Layout Components        # Layout-Komponenten
│
├── lib/                         # Utilities & Logic
│   ├── store.ts                 # Zustand State Management
│   ├── codeGenerator.ts         # Arduino Code Generator
│   └── types.ts                 # TypeScript Types
│
└── styles/                      # CSS & Tailwind

```

### State Management

Das Projekt verwendet **Zustand** für globales State Management:

```typescript
interface DesignElement {
  id: string;
  type: "rect" | "circle" | "text" | "line" | "button";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  // ... weitere Properties
}

const useDesignStore = create<DesignStore>((set) => ({
  elements: [],
  selectedElement: null,
  addElement: (element) => { /* ... */ },
  updateElement: (id, updates) => { /* ... */ },
  deleteElement: (id) => { /* ... */ },
}));
```

## 🛠️ Technologie Stack

| Bereich | Technologie |
|---------|------------|
| **Framework** | Next.js 14 |
| **React** | React 18 |
| **State** | Zustand |
| **Code Editor** | Monaco Editor |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Language** | TypeScript |

## 📋 Unterstützte Elemente

### Rechteck
```
- Position (X, Y)
- Größe (Breite, Höhe)
- Farbe
- Rahmen (Breite, Farbe)
```

### Kreis
```
- Position (X, Y)
- Radius
- Farbe
- Rahmen (Breite, Farbe)
```

### Text
```
- Position (X, Y)
- Text-Inhalt
- Schriftgröße
- Farbe
```

### Linie
```
- Start-Position (X, Y)
- End-Position (durch Breite, Höhe definiert)
- Farbe
- Breite
```

### Button
```
- Position (X, Y)
- Größe
- Text
- Farbe
- Rahmen
```

## 🔮 Roadmap

- [x] Basis Designer Interface
- [x] Canvas Rendering
- [x] Property Panel
- [x] Monaco Editor Integration
- [ ] Code Export (Arduino)
- [ ] Drag & Drop Positioning
- [ ] Undo/Redo
- [ ] Element Animationen
- [ ] Custom Fonts
- [ ] Image Upload
- [ ] Projekt Save/Load
- [ ] Collaboration Features
- [ ] Plugin System

## 🤝 Contributing

Contributions sind willkommen! Bitte erstelle einen Pull Request mit deinen Verbesserungen.

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details

## 📞 Support

- 📖 [TFT_eSPI Dokumentation](https://github.com/Bodmer/TFT_eSPI)
- 💬 Issues und Diskussionen auf GitHub
- 📧 Kontakt über GitHub Issues

---

**Made with ❤️ für die Maker Community**

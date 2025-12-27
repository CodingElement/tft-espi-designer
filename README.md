# TFT-eSPI Designer

Ein Online-Designer für die **TFT-eSPI Bibliothek** mit integriertem Code-Editor und Live-Vorschau. Erstelle interaktive UI-Designs für TFT-Displays direkt im Browser.

## Features

✨ **Live-Vorschau** - Sehen Sie Ihre Designs in Echtzeit  
🎨 **Designelemente** - Buttons, Text, Rechtecke, Linien, Kreise und Bilder  
💻 **Code-Editor** - Schreiben Sie TFT_eSPI C++ Code direkt im Browser  
🎯 **Interaktive Elemente** - Drag & Drop Designer mit Eigenschaften-Panel  
📦 **Code-Export** - Generieren Sie Arduino-kompatiblen Code  
🌐 **Vollständig Online** - Keine Installation notwendig  

## Schnellstart

```bash
# Installation
npm install

# Development-Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Projektstruktur

```
src/
├── app/              # Next.js App-Router
├── components/       # React-Komponenten
│   ├── Editor.tsx
│   ├── Preview.tsx
│   ├── Toolbar.tsx
│   └── PropertyPanel.tsx
├── lib/
│   ├── store.ts      # Zustand State Management
│   ├── elements.ts   # Element-Definitionen
│   └── codeGenerator.ts
└── styles/           # Tailwind CSS
```

## Verwendung

1. **Elemente hinzufügen** - Wähle Designelemente aus der Toolbar
2. **Eigenschaften ändern** - Nutze das Property-Panel für Farbe, Größe, Text
3. **Code bearbeiten** - Schreibe oder generiere TFT_eSPI Code
4. **Vorschau ansehen** - Live-Rendering des Designs
5. **Code exportieren** - Kopiere den generierten Arduino-Code

## Unterstützte Elemente

- **Rechtecke** - mit Farbe, Größe und Rahmen
- **Kreise** - mit Radius und Farbe
- **Text** - mit Font, Größe und Farbe
- **Linien** - mit Breite und Farbe
- **Buttons** - mit Text und Callbacks
- **Bilder** - PNG/JPG Upload und Platzierung

## Technologie-Stack

- **Frontend**: Next.js 14, React 18
- **Editor**: Monaco Editor
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Roadmap

- [ ] Export zu Arduino-Code
- [ ] Element-Animationen
- [ ] Multiple Screen-Größen
- [ ] Fonts-Manager
- [ ] Plugin-System
- [ ] Kolaboratives Editing

## Lizenz

MIT License - Copyright (c) 2025 CodingElement

Dieses Projekt ist unter der MIT-Lizenz lizenziert, die kommerzieller Nutzung, Modifikationen und Weitergabe erlaubt - solange der Original-Autor genannt wird.

Siehe [LICENSE](LICENSE) für die vollständigen Details.

## Autor

Erstellt von **CodingElement** als TFT-eSPI Designer Tool

---

**Hinweis**: Dies ist ein Designer-Tool. Das generierte Code muss mit der offiziellen [TFT_eSPI Bibliothek](https://github.com/Bodmer/TFT_eSPI) verwendet werden.

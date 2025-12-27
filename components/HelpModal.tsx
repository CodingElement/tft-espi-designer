"use client";

import { X, Square, Circle, Minus, Type, Move, Trash2, Copy, Scissors, ClipboardPaste, Undo2, Redo2, ZoomIn, ZoomOut, Settings } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Hilfe & Anleitung</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            aria-label="Schließen"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-8">
          {/* Übersicht */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Übersicht</h3>
            <p className="text-gray-300 leading-relaxed">
              Der TFT-eSPI Designer ist ein visueller Editor zur Erstellung von Benutzeroberflächen für TFT-Displays.
              Du kannst Objekte per Drag & Drop platzieren, ihre Eigenschaften anpassen und den Arduino-Code automatisch generieren lassen.
            </p>
          </section>

          {/* Objekte erstellen */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Objekte erstellen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Square size={20} className="text-green-400" />
                  <span className="font-semibold">Rechteck</span>
                </div>
                <p className="text-sm text-gray-400">
                  Erstellt ein Rechteck mit konfigurierbarer Position, Größe, Farbe und Füllung.
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Circle size={20} className="text-blue-400" />
                  <span className="font-semibold">Kreis</span>
                </div>
                <p className="text-sm text-gray-400">
                  Erstellt einen Kreis mit konfigurierbarem Radius, Farbe und Füllung.
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Minus size={20} className="text-yellow-400" />
                  <span className="font-semibold">Linie</span>
                </div>
                <p className="text-sm text-gray-400">
                  Erstellt eine Linie zwischen zwei Punkten mit konfigurierbarer Farbe.
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Type size={20} className="text-purple-400" />
                  <span className="font-semibold">Text</span>
                </div>
                <p className="text-sm text-gray-400">
                  Erstellt einen Text mit Schriftgröße, Farbe und automatischem Zeilenumbruch.
                </p>
              </div>
            </div>
          </section>

          {/* Eigenschaften Panel */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Eigenschaften Panel</h3>
            <p className="text-gray-300 mb-3">
              Wähle ein Objekt aus, um seine Eigenschaften zu bearbeiten:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li><span className="font-semibold">Position (X, Y):</span> Verschiebe das Objekt pixelgenau</li>
              <li><span className="font-semibold">Größe:</span> Breite und Höhe für Rechtecke, Radius für Kreise</li>
              <li><span className="font-semibold">Farbe:</span> Wähle aus vordefinierten TFT_eSPI-Farben</li>
              <li><span className="font-semibold">Füllung:</span> Gefüllte oder hohle Objekte (Rechteck/Kreis)</li>
              <li><span className="font-semibold">Text:</span> Inhalt, Schriftgröße und Zeilenumbruch-Breite</li>
            </ul>
          </section>

          {/* Tastenkombinationen */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Tastenkombinationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm font-mono">Entf</kbd>
                <span className="text-gray-300">Ausgewähltes Objekt löschen</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm font-mono">Strg+C</kbd>
                <span className="text-gray-300">Kopieren</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm font-mono">Strg+X</kbd>
                <span className="text-gray-300">Ausschneiden</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm font-mono">Strg+V</kbd>
                <span className="text-gray-300">Einfügen</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm font-mono">Strg+Z</kbd>
                <span className="text-gray-300">Rückgängig</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm font-mono">Strg+Y</kbd>
                <span className="text-gray-300">Wiederherstellen</span>
              </div>
            </div>
          </section>

          {/* Toolbar-Symbole */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Vorschau-Werkzeuge</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <Move size={20} className="text-gray-400" />
                <span className="text-gray-300">Objekte verschieben (Drag & Drop)</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <Undo2 size={20} className="text-gray-400" />
                <span className="text-gray-300">Rückgängig machen</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <Redo2 size={20} className="text-gray-400" />
                <span className="text-gray-300">Wiederherstellen</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <Trash2 size={20} className="text-red-400" />
                <span className="text-gray-300">Alle Objekte löschen</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <ZoomIn size={20} className="text-gray-400" />
                <span className="text-gray-300">Vorschau vergrößern</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 p-3 rounded border border-gray-700">
                <ZoomOut size={20} className="text-gray-400" />
                <span className="text-gray-300">Vorschau verkleinern</span>
              </div>
            </div>
          </section>

          {/* Display-Einstellungen */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Display-Einstellungen</h3>
            <p className="text-gray-300 mb-3">
              Klicke auf das <Settings size={16} className="inline text-gray-400" /> Symbol im Header, um:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li><span className="font-semibold">Display-Größe:</span> Wähle die Auflösung deines TFT-Displays</li>
              <li><span className="font-semibold">Hintergrundfarbe:</span> Setze die Canvas-Hintergrundfarbe</li>
            </ul>
          </section>

          {/* Code-Generierung */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Code-Generierung</h3>
            <div className="space-y-3">
              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <h4 className="font-semibold mb-2 text-green-400">Auto-Sync</h4>
                <p className="text-sm text-gray-400">
                  Wenn aktiviert, wird der Arduino-Code automatisch bei jeder Änderung aktualisiert.
                  Wird automatisch deaktiviert, wenn du den Code manuell bearbeitest.
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <h4 className="font-semibold mb-2 text-blue-400">Eigene Funktionen</h4>
                <p className="text-sm text-gray-400 mb-2">
                  Du kannst eigene Funktionen zwischen den Markierungen hinzufügen:
                </p>
                <code className="block bg-gray-800 p-2 rounded text-xs text-green-400">
                  // CUSTOM CODE START<br />
                  void myFunction() &#123; /* dein Code */ &#125;<br />
                  // CUSTOM CODE END
                </code>
                <p className="text-sm text-gray-400 mt-2">
                  Dieser Code bleibt erhalten, auch wenn du Auto-Sync aktivierst.
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <h4 className="font-semibold mb-2 text-yellow-400">Code aktualisieren</h4>
                <p className="text-sm text-gray-400">
                  Nach manueller Code-Bearbeitung kannst du mit dem "↻ Code aktualisieren" Button
                  die Änderungen zurücksetzen und den Code neu generieren lassen.
                </p>
              </div>
            </div>
          </section>

          {/* Tipps & Tricks */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Tipps & Tricks</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Nutze die Panel-Trennlinien zum Anpassen der Layout-Größen</li>
              <li>Texte brechen automatisch um, wenn sie die eingestellte Breite überschreiten</li>
              <li>Die Undo-Funktion speichert die letzten 50 Schritte</li>
              <li>Klicke auf den Hintergrund, um die Auswahl aufzuheben</li>
              <li>Die Vorschau kannst du mit Mausrad + Strg zoomen</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-400">TFT-eSPI Designer v2.0</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}

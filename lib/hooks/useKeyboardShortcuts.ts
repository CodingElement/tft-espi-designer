import { useEffect } from "react";
import { useDesignStore, type DesignElement } from "@/lib/store";

interface UseKeyboardShortcutsOptions {
  clipboard: DesignElement | null;
  onCopy: (element: DesignElement) => void;
  onCut: (element: DesignElement) => void;
  onPaste: (element: DesignElement) => void;
}

export function useKeyboardShortcuts({
  clipboard,
  onCopy,
  onCut,
  onPaste,
}: UseKeyboardShortcutsOptions) {
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
      const selectedElement = store.selectedElement;

      // Delete key removes selected element
      if (e.key === "Delete" && selectedElement) {
        e.preventDefault();
        store.deleteElement(selectedElement.id);
        return;
      }

      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        // Undo (Ctrl+Z)
        if (e.key.toLowerCase() === "z" && !e.shiftKey) {
          e.preventDefault();
          store.undo();
          return;
        }
        
        // Redo (Ctrl+Y or Ctrl+Shift+Z)
        if (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey)) {
          e.preventDefault();
          store.redo();
          return;
        }
        
        // Copy (Ctrl+C)
        if (e.key.toLowerCase() === "c" && selectedElement) {
          e.preventDefault();
          onCopy(selectedElement);
          return;
        }
        
        // Cut (Ctrl+X)
        if (e.key.toLowerCase() === "x" && selectedElement) {
          e.preventDefault();
          onCut(selectedElement);
          store.deleteElement(selectedElement.id);
          return;
        }
        
        // Paste (Ctrl+V)
        if (e.key.toLowerCase() === "v" && clipboard) {
          e.preventDefault();
          onPaste(clipboard);
          return;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clipboard, onCopy, onCut, onPaste]);
}

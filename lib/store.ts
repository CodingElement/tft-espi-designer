import { create } from "zustand";

export type ElementType = "rect" | "circle" | "text" | "line" | "button" | "image" | "triangle";

export interface DesignElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  text?: string;
  color: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  fontSize?: number;
  rotation?: number;
  opacity?: number;
}

interface DesignStore {
  elements: DesignElement[];
  selectedElement: DesignElement | null;
  displayWidth: number;
  displayHeight: number;
  previewScale: number;
  backgroundColor: string;
  history: DesignElement[][];
  historyIndex: number;
  setElements: (elements: DesignElement[]) => void;
  addElement: (element: DesignElement) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setDisplaySize: (width: number, height: number) => void;
  setPreviewScale: (scale: number) => void;
  setBackgroundColor: (color: string) => void;
  clearAll: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useDesignStore = create<DesignStore>((set, get) => {
  // Helper function to save current state to history
  const saveToHistory = () => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(state.elements)));
    // Limit history to 50 steps
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      set({ history: newHistory, historyIndex: newHistory.length - 1 });
      return;
    }
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  };

  return {
    elements: [],
    selectedElement: null,
    displayWidth: 320,
    displayHeight: 240,
    previewScale: 1,
    backgroundColor: "#000000",
    history: [[]],
    historyIndex: 0,

    setElements: (elements) =>
      set(() => ({
        elements,
        selectedElement: null,
      })),

    addElement: (element) => {
      saveToHistory();
      set((state) => ({
        elements: [...state.elements, element],
        selectedElement: element,
      }));
    },

    updateElement: (id, updates) => {
      saveToHistory();
      set((state) => ({
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ),
        selectedElement:
          state.selectedElement?.id === id
            ? { ...state.selectedElement, ...updates }
            : state.selectedElement,
      }));
    },

    deleteElement: (id) => {
      saveToHistory();
      set((state) => ({
        elements: state.elements.filter((el) => el.id !== id),
        selectedElement:
          state.selectedElement?.id === id ? null : state.selectedElement,
      }));
    },

  selectElement: (id) =>
    set((state) => ({
      selectedElement: id
        ? state.elements.find((el) => el.id === id) || null
        : null,
    })),

  setDisplaySize: (width, height) =>
    set({
      displayWidth: width,
      displayHeight: height,
    }),

  setPreviewScale: (scale) =>
    set({
      previewScale: Math.max(0.5, Math.min(scale, 8)),
    }),

  setBackgroundColor: (color) =>
    set({
      backgroundColor: color,
    }),

    clearAll: () => {
      saveToHistory();
      set({
        elements: [],
        selectedElement: null,
      });
    },

    undo: () => {
      const state = get();
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        set({
          elements: JSON.parse(JSON.stringify(state.history[newIndex])),
          historyIndex: newIndex,
          selectedElement: null,
        });
      }
    },

    redo: () => {
      const state = get();
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        set({
          elements: JSON.parse(JSON.stringify(state.history[newIndex])),
          historyIndex: newIndex,
          selectedElement: null,
        });
      }
    },

    canUndo: () => {
      return get().historyIndex > 0;
    },

    canRedo: () => {
      const state = get();
      return state.historyIndex < state.history.length - 1;
    },
  };
});

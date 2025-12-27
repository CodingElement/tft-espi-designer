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
  backgroundColor: string;
  addElement: (element: DesignElement) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setDisplaySize: (width: number, height: number) => void;
  setBackgroundColor: (color: string) => void;
  clearAll: () => void;
}

export const useDesignStore = create<DesignStore>((set) => ({
  elements: [],
  selectedElement: null,
  displayWidth: 320,
  displayHeight: 240,
  backgroundColor: "#000000",

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
      selectedElement: element,
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
      selectedElement:
        state.selectedElement?.id === id
          ? { ...state.selectedElement, ...updates }
          : state.selectedElement,
    })),

  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElement:
        state.selectedElement?.id === id ? null : state.selectedElement,
    })),

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

  setBackgroundColor: (color) =>
    set({
      backgroundColor: color,
    }),

  clearAll: () =>
    set({
      elements: [],
      selectedElement: null,
    }),
}));

import { useState, useEffect } from "react";

interface UseResizableOptions {
  defaultWidth: number;
  minWidth: number;
  containerSelector: string;
  resizeFromRight?: boolean;
  maxWidthConstraint?: number;
}

export function useResizable({
  defaultWidth,
  minWidth,
  containerSelector,
  resizeFromRight = false,
  maxWidthConstraint,
}: UseResizableOptions) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const container = document.querySelector(containerSelector) as HTMLElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      
      let newWidth: number;
      if (resizeFromRight) {
        // Resize from right edge (like editor)
        newWidth = containerRect.right - e.clientX;
      } else {
        // Resize from left edge (like property panel)
        newWidth = e.clientX - containerRect.left;
      }
      
      // Apply constraints
      let maxWidth: number;
      if (maxWidthConstraint) {
        // If constraint is provided, calculate max based on container and constraint
        maxWidth = containerRect.width - maxWidthConstraint;
      } else {
        // Default: leave minWidth for the other side
        maxWidth = containerRect.width - minWidth;
      }
      
      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [isResizing, containerSelector, minWidth, maxWidthConstraint, resizeFromRight]);

  return {
    width,
    isResizing,
    startResizing: () => setIsResizing(true),
  };
}

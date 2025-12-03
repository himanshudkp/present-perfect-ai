"use client";

import type { Action } from "@/types";
import { useEffect, useState } from "react";

export const useKeyboardNavigation = (
  open: boolean,
  filteredActions: Action[],
  onAction: (action: Action) => void
) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredActions]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? filteredActions.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredActions[selectedIndex];
        if (selected) {
          onAction(selected);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredActions, selectedIndex, onAction]);

  return { selectedIndex, setSelectedIndex };
};

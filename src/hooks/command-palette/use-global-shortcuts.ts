"use client";

import { useEffect } from "react";
import type { Action } from "@/types";

export const useGlobalShortcuts = (
  open: boolean,
  setOpen: (open: boolean) => void,
  actions: Action[],
  onNavigate?: (path: string) => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
        return;
      }

      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }

      if (!open && (e.metaKey || e.ctrlKey)) {
        const action = actions.find((a) => a.shortcut === e.key.toUpperCase());
        if (action) {
          e.preventDefault();
          action.action();
          onNavigate?.(action.id);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen, actions, onNavigate]);
};

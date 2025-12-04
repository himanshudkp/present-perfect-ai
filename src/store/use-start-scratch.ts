"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { OutlineCard } from "@/types";

interface StartScratchStore {
  outlines: OutlineCard[];
  addOutline: (outline: OutlineCard) => void;
  addMultipleOutlines: (outlines: OutlineCard[]) => void;
  updateOutline: (id: string, updates: Partial<OutlineCard>) => void;
  deleteOutline: (id: string) => void;
  resetOutlines: () => void;
}

export const useStartScratchStore = create<StartScratchStore>()(
  devtools(
    persist(
      (set) => ({
        outlines: [],

        addOutline: (outline) =>
          set(
            (state) => ({
              outlines: [...state.outlines, outline],
            }),
            false,
            "addOutline"
          ),

        addMultipleOutlines: (newOutlines) =>
          set(
            () => ({
              outlines: newOutlines,
            }),
            false,
            "addMultipleOutlines"
          ),

        updateOutline: (id, updates) =>
          set(
            (state) => ({
              outlines: state.outlines.map((card) =>
                card.id === id ? { ...card, ...updates } : card
              ),
            }),
            false,
            "updateOutline"
          ),

        deleteOutline: (id) =>
          set(
            (state) => ({
              outlines: state.outlines
                .filter((card) => card.id !== id)
                .map((card, index) => ({ ...card, order: index + 1 })),
            }),
            false,
            "deleteOutline"
          ),

        resetOutlines: () =>
          set(
            () => ({
              outlines: [],
            }),
            false,
            "resetOutlines"
          ),
      }),
      {
        name: "start-scratch-store",
      }
    )
  )
);

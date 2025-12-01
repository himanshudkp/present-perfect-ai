import { OutlineCard } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type StartScratchStore = {
  outlines: OutlineCard[];
  addOutline: (outline: OutlineCard) => void;
  addMultipleOutlines: (outlines: OutlineCard[]) => void;
  updateOutline: (id: string, updates: Partial<OutlineCard>) => void;
  deleteOutline: (id: string) => void;
  resetOutlines: () => void;
};

export const useStartScratchStore = create<StartScratchStore>()(
  devtools(
    persist(
      (set) => ({
        outlines: [],

        // Add a single outline (append to the end)
        addOutline: (outline) =>
          set(
            (state) => ({
              outlines: [...state.outlines, outline],
            }),
            false,
            "addOutline"
          ),

        // Replace ALL outlines (used for reordering and bulk updates)
        // 🔥 THIS WAS THE BUG - it was appending instead of replacing!
        addMultipleOutlines: (newOutlines) =>
          set(
            () => ({
              outlines: newOutlines, // ✅ REPLACE, don't append!
            }),
            false,
            "addMultipleOutlines"
          ),

        // Update a specific outline
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

        // Delete an outline and reorder
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

        // Reset all outlines
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

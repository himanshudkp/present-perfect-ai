"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { OutlineCard } from "@/types";

interface CreativeAiStore {
  outlines: OutlineCard[];
  currentAIPrompt: string;
  setCurrentAIPrompt: (prompt: string) => void;
  addOutline: (outline: OutlineCard) => void;
  addMultipleOutlines: (outlines: OutlineCard[]) => void;
  updateOutline: (id: string, updates: Partial<OutlineCard>) => void;
  deleteOutline: (id: string) => void;
  resetOutlines: () => void;
}

export const useCreativeAiStore = create<CreativeAiStore>()(
  devtools(
    persist(
      (set) => ({
        outlines: [],
        currentAIPrompt: "",

        setCurrentAIPrompt: (prompt) =>
          set(
            () => ({
              currentAIPrompt: prompt,
            }),
            false,
            "setCurrentAIPrompt"
          ),

        addOutline: (outline) =>
          set(
            (state) => ({
              outlines: [...state.outlines, outline],
            }),
            false,
            "addOutline"
          ),

        // Replace ALL outlines (for AI generation and reordering)
        addMultipleOutlines: (newOutlines) =>
          set(
            () => ({
              outlines: newOutlines, // ✅ REPLACE, don't append!
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
              currentAIPrompt: "",
            }),
            false,
            "resetOutlines"
          ),
      }),
      {
        name: "creative-ai-store",
      }
    )
  )
);

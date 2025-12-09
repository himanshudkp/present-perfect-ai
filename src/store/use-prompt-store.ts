"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Page, PromptHistory } from "@/lib/types";

interface PromptStore {
  page: Page;
  prompts: PromptHistory[];

  setPage: (page: Page) => void;
  addPrompt: (prompt: PromptHistory) => void;
  deletePrompt: (id: string) => void;
  clearPrompts: () => void;
}

export const usePromptStore = create<PromptStore>()(
  devtools(
    persist(
      (set) => ({
        page: "create",

        prompts: [],

        setPage: (page: Page) => set({ page }),

        addPrompt: (prompt) =>
          set((state) => ({
            prompts: [prompt, ...state.prompts].slice(0, 10), // Keep last 10
          })),

        deletePrompt: (id) =>
          set((state) => ({
            prompts: state.prompts.filter((p) => p.id !== id),
          })),

        clearPrompts: () => set({ prompts: [] }),
      }),
      {
        name: "prompt-store",
      }
    )
  )
);

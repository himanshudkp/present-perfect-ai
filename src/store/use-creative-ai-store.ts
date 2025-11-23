// import { OutlineCard } from "@/lib/types";
// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";

// type CreativeAiStore = {
//   outlines: OutlineCard[] | [];
//   addOutline: (outlines: OutlineCard) => void;
//   addMultipleOutlines: (outlines: OutlineCard[]) => void;
//   currentAIPrompt: string;
//   setCurrentAIPrompt: (prompt: string) => void;
//   resetOutlines: () => void;
// };

// export const useCreativeAiStore = create<CreativeAiStore>()(
//   devtools(
//     persist(
//       (set) => ({
//         outlines: [],
//         currentAIPrompt: "",
//         addOutline: (outline) => {
//           set((state) => ({
//             outlines: [outline, ...state.outlines],
//           }));
//         },
//         addMultipleOutlines: (outlines) =>
//           set(() => ({
//             outlines: [...outlines],
//           })),
//         setCurrentAIPrompt: (prompt) => {
//           set({ currentAIPrompt: prompt });
//         },
//         resetOutlines: () => {
//           set({ outlines: [] });
//         },
//       }),
//       { name: "creative-ai-store" }
//     )
//   )
// );

import { OutlineCard } from "@/lib/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type CreativeAiStore = {
  outlines: OutlineCard[];
  currentAIPrompt: string;
  setCurrentAIPrompt: (prompt: string) => void;
  addOutline: (outline: OutlineCard) => void;
  addMultipleOutlines: (outlines: OutlineCard[]) => void;
  updateOutline: (id: string, updates: Partial<OutlineCard>) => void;
  deleteOutline: (id: string) => void;
  resetOutlines: () => void;
};

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

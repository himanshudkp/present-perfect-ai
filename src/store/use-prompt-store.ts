// import { OutlineCard } from "@/lib/types";
// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";

// type Prompt = {
//   id: string;
//   createdAt: string;
//   title: string;
//   outlines: OutlineCard[] | [];
// };

// type Page = "create" | "creative-ai" | "create-scratch";

// type PromptStore = {
//   page: Page;
//   prompts: Prompt[];
//   setPage: (page: Page) => void;
//   addPrompts: (prompt: Prompt) => void;
//   removePrompts: (id: string) => void;
// };

// export const usePromptStore = create<PromptStore>()(
//   devtools(
//     persist(
//       (set) => ({
//         page: "create",
//         prompts: [
//           {
//             id: "prompt_001",
//             createdAt: "2025-01-12T10:24:00.000Z",
//             title: "AI Presentation on Climate Change",
//             outlines: [
//               {
//                 id: "outline_001",
//                 title: "Introduction to Climate Change",
//                 order: 1,
//               },
//               {
//                 id: "outline_002",
//                 title: "Causes of Global Warming",
//                 order: 2,
//               },
//               { id: "outline_003", title: "Environmental Impact", order: 3 },
//             ],
//           },
//           {
//             id: "prompt_002",
//             createdAt: "2025-02-03T14:10:00.000Z",
//             title: "Business Pitch Deck Outline",
//             outlines: [
//               { id: "outline_004", title: "Problem Statement", order: 1 },
//               { id: "outline_005", title: "Market Opportunity", order: 2 },
//               { id: "outline_006", title: "Solution Overview", order: 3 },
//               { id: "outline_007", title: "Revenue Model", order: 4 },
//             ],
//           },
//           {
//             id: "prompt_003",
//             createdAt: "2025-01-28T08:55:00.000Z",
//             title: "Web Development Fundamentals",
//             outlines: [
//               { id: "outline_008", title: "HTML Basics", order: 1 },
//               { id: "outline_009", title: "CSS Essentials", order: 2 },
//               { id: "outline_010", title: "JavaScript Intro", order: 3 },
//             ],
//           },
//           {
//             id: "prompt_004",
//             createdAt: "2025-03-10T09:40:00.000Z",
//             title: "Health & Fitness Presentation",
//             outlines: [
//               {
//                 id: "outline_011",
//                 title: "Benefits of Daily Exercise",
//                 order: 1,
//               },
//               { id: "outline_012", title: "Nutrition Basics", order: 2 },
//               { id: "outline_013", title: "Mental Health Impact", order: 3 },
//               { id: "outline_014", title: "Fitness Routines", order: 4 },
//             ],
//           },
//           {
//             id: "prompt_005",
//             createdAt: "2025-02-21T12:30:00.000Z",
//             title: "History of Artificial Intelligence",
//             outlines: [
//               { id: "outline_015", title: "Early AI Concepts", order: 1 },
//               { id: "outline_016", title: "AI Winter & Revival", order: 2 },
//               {
//                 id: "outline_017",
//                 title: "Deep Learning Revolution",
//                 order: 3,
//               },
//               { id: "outline_018", title: "Modern AI Applications", order: 4 },
//               { id: "outline_019", title: "Future Predictions", order: 5 },
//             ],
//           },
//         ],
//         setPage: (page) => set({ page }),
//         addPrompts: (prompt) =>
//           set((state) => ({
//             prompts: [prompt, ...state.prompts],
//           })),
//         removePrompts: (id) =>
//           set((state) => ({
//             prompts: state.prompts.filter((prompt) => prompt.id !== id),
//           })),
//       }),
//       { name: "prompt-store" }
//     )
//   )
// );

import { OutlineCard } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type PromptHistory = {
  id: string;
  createdAt: string;
  title: string;
  outlines: OutlineCard[];
};

type Page = "create" | "creative-ai" | "create-scratch";

type PromptStore = {
  page: Page;
  prompts: PromptHistory[];

  // Actions
  setPage: (page: Page) => void;
  addPrompt: (prompt: PromptHistory) => void;
  deletePrompt: (id: string) => void;
  clearPrompts: () => void;
};

export const usePromptStore = create<PromptStore>()(
  devtools(
    persist(
      (set) => ({
        page: "create",

        prompts: [
          {
            id: "prompt_001",
            createdAt: "2025-01-12T10:24:00.000Z",
            title: "AI Presentation on Climate Change",
            outlines: [
              {
                id: "outline_001",
                title: "Introduction to Climate Change",
                order: 1,
              },
              {
                id: "outline_002",
                title: "Causes of Global Warming",
                order: 2,
              },
              { id: "outline_003", title: "Environmental Impact", order: 3 },
            ],
          },
          {
            id: "prompt_002",
            createdAt: "2025-02-03T14:10:00.000Z",
            title: "Business Pitch Deck Outline",
            outlines: [
              { id: "outline_004", title: "Problem Statement", order: 1 },
              { id: "outline_005", title: "Market Opportunity", order: 2 },
              { id: "outline_006", title: "Solution Overview", order: 3 },
              { id: "outline_007", title: "Revenue Model", order: 4 },
            ],
          },
          {
            id: "prompt_003",
            createdAt: "2025-01-28T08:55:00.000Z",
            title: "Web Development Fundamentals",
            outlines: [
              { id: "outline_008", title: "HTML Basics", order: 1 },
              { id: "outline_009", title: "CSS Essentials", order: 2 },
              { id: "outline_010", title: "JavaScript Intro", order: 3 },
            ],
          },
          {
            id: "prompt_004",
            createdAt: "2025-03-10T09:40:00.000Z",
            title: "Health & Fitness Presentation",
            outlines: [
              {
                id: "outline_011",
                title: "Benefits of Daily Exercise",
                order: 1,
              },
              { id: "outline_012", title: "Nutrition Basics", order: 2 },
              { id: "outline_013", title: "Mental Health Impact", order: 3 },
              { id: "outline_014", title: "Fitness Routines", order: 4 },
            ],
          },
          {
            id: "prompt_005",
            createdAt: "2025-02-21T12:30:00.000Z",
            title: "History of Artificial Intelligence",
            outlines: [
              { id: "outline_015", title: "Early AI Concepts", order: 1 },
              { id: "outline_016", title: "AI Winter & Revival", order: 2 },
              {
                id: "outline_017",
                title: "Deep Learning Revolution",
                order: 3,
              },
              { id: "outline_018", title: "Modern AI Applications", order: 4 },
              { id: "outline_019", title: "Future Predictions", order: 5 },
            ],
          },
        ],

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

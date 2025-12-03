import { Project } from "@/generated/prisma/client";
import { Slide, Theme } from "@/types";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface SlideState {
  slides: Slide[];
  setSlides: (slides: Slide[]) => void;
  addSlide: (slide: Slide) => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlides: (slides: Slide[]) => void;
  clearSlides: () => void;

  project: Project | null;
  setProject: (project: Project) => void;
  clearProject: () => void;

  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;

  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => void;
}

const defaultTheme: Theme = {
  fontFamily: "Inter, sans-serif",
  fontColor: "#333333",
  bgColor: "#F0F0F0",
  slideBgColor: "#FFFFFF",
  accentColor: "#3B82F6",
  type: "light",
  name: "",
  gradientBgColor: "",
  navbarColor: "",
  sidebarColor: "",
};

export const useSlideStore = create<SlideState>()(
  devtools(
    persist(
      (set, get) => ({
        slides: [],
        project: null,
        currentSlideIndex: 0,
        currentTheme: defaultTheme,

        setSlides: (slides) => set({ slides }, false, "setSlides"),
        setCurrentTheme: (theme: Theme) => set(() => ({ currentTheme: theme })),
        addSlide: (slide) =>
          set(
            (state) => ({
              slides: [...state.slides, slide],
            }),
            false,
            "addSlide"
          ),

        updateSlide: (id, updates) =>
          set(
            (state) => ({
              slides: state.slides.map((slide) =>
                slide.id === id ? { ...slide, ...updates } : slide
              ),
            }),
            false,
            "updateSlide"
          ),

        deleteSlide: (id) =>
          set(
            (state) => ({
              slides: state.slides.filter((slide) => slide.id !== id),
            }),
            false,
            "deleteSlide"
          ),

        reorderSlides: (slides) => set({ slides }, false, "reorderSlides"),

        clearSlides: () =>
          set({ slides: [], currentSlideIndex: 0 }, false, "clearSlides"),

        // Project operations
        setProject: (project) => set({ project }, false, "setProject"),

        clearProject: () =>
          set(
            { project: null, slides: [], currentSlideIndex: 0 },
            false,
            "clearProject"
          ),

        // Navigation
        setCurrentSlideIndex: (index) =>
          set({ currentSlideIndex: index }, false, "setCurrentSlideIndex"),

        nextSlide: () =>
          set(
            (state) => ({
              currentSlideIndex: Math.min(
                state.currentSlideIndex + 1,
                state.slides.length - 1
              ),
            }),
            false,
            "nextSlide"
          ),

        previousSlide: () =>
          set(
            (state) => ({
              currentSlideIndex: Math.max(state.currentSlideIndex - 1, 0),
            }),
            false,
            "previousSlide"
          ),
      }),
      {
        name: "slide-store",
      }
    )
  )
);

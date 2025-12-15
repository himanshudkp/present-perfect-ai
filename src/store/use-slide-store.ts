"use client";

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { DEFAULT_THEME } from "@/lib/constants";
import type { Project } from "@/generated/prisma/client";
import type { ContentItem, Slide, Theme } from "@/lib/types";

interface SlideState {
  slides: Slide[];
  setSlides: (slides: Slide[]) => void;
  addSlide: (slide: Slide, index: number) => void;
  updateCurrentSlide: (
    id: string,
    newContent:
      | ContentItem
      | string
      | string[]
      | string[][]
      | ContentItem[]
      | (string | ContentItem)[],
    contentId: string
  ) => void;
  deleteSlide: (id: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
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

  getOrderedSlides: () => Slide[];

  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  addComponentIntoSlide: (
    slideId: string,
    item: ContentItem,
    parentId: string,
    index: number
  ) => void;
}

export const useSlideStore = create<SlideState>()(
  devtools(
    persist(
      (set, get) => ({
        slides: [],
        project: null,
        currentSlideIndex: 0,
        currentTheme: DEFAULT_THEME,
        currentSlide: 0,

        setSlides: (slides) => set({ slides }),

        setCurrentTheme: (theme) => set({ currentTheme: theme }),

        addSlide: (slide, index) =>
          set(
            (state) => {
              const newSlides = [...state.slides];
              newSlides.splice(index, 0, {
                ...slide,
                id: crypto.randomUUID(),
              });

              newSlides.forEach((s, i) => {
                s.slideOrder = i;
              });

              return {
                slides: newSlides,
                currentSlideIndex: index,
              };
            },
            false,
            "addSlide"
          ),

        updateCurrentSlide: (id, newContent, contentId) =>
          set(
            (state) => {
              const updateContentRecursively = (
                item: ContentItem
              ): ContentItem => {
                if (item.id === contentId) {
                  return { ...item, content: newContent };
                }

                if (Array.isArray(item.content)) {
                  return {
                    ...item,
                    content: item.content.map((subItem) =>
                      typeof subItem === "string"
                        ? subItem
                        : updateContentRecursively(subItem as ContentItem)
                    ),
                  };
                }

                return item;
              };

              return {
                slides: state.slides.map((slide) =>
                  slide.id === id
                    ? {
                        ...slide,
                        content: updateContentRecursively(slide.content),
                      }
                    : slide
                ),
              };
            },
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

        reorderSlides: (fromIndex, toIndex) =>
          set((state) => {
            const newSlides = [...state.slides];
            const [removed] = newSlides.splice(fromIndex, 1);
            newSlides.splice(toIndex, 0, removed);

            return {
              slides: newSlides.map((slide, index) => ({
                ...slide,
                slideOrder: index,
              })),
            };
          }),

        clearSlides: () =>
          set({ slides: [], currentSlideIndex: 0 }, false, "clearSlides"),

        setProject: (project) => set({ project }, false, "setProject"),

        clearProject: () =>
          set(
            { project: null, slides: [], currentSlideIndex: 0 },
            false,
            "clearProject"
          ),

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

        getOrderedSlides: () => {
          const { slides } = get();
          return Array.isArray(slides)
            ? [...slides].sort((a, b) => a.slideOrder - b.slideOrder)
            : [];
        },

        setCurrentSlide: (index) =>
          set((state) => ({
            currentSlideIndex: Math.max(
              0,
              Math.min(index, state.slides.length - 1)
            ),
          })),
        addComponentIntoSlide: (
          slideId: string,
          item: ContentItem,
          parentId: string,
          index: number
        ) => {
          set((state: SlideState) => {
            const updatedSlides = state.slides.map((slide) => {
              if (slide.id === slideId) {
                const updateContentRecursively = (
                  content: ContentItem
                ): ContentItem => {
                  if (
                    content.id === parentId &&
                    Array.isArray(content.content)
                  ) {
                    const updatedContent = [...content.content];
                    updatedContent.splice(index, 0, item);
                    return {
                      ...content,
                      content: updatedContent as unknown as string[],
                    };
                  }
                  return content;
                };
                return {
                  ...slide,
                  content: updateContentRecursively(slide.content),
                };
              }
              return slide;
            });
            return { slides: updatedSlides };
          });
        },
      }),

      {
        name: "slide-store",
      }
    )
  )
);

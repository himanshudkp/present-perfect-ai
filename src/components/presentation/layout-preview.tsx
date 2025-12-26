"use client";

import { memo, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

import { useSlideStore } from "@/store/use-slide-store";
import SlidePreview from "./slide-preview";

interface LayoutPreviewProps {
  onSlideSelect?: (index: number) => void;
}

const LayoutPreview = memo(({ onSlideSelect }: LayoutPreviewProps) => {
  const [loading, setLoading] = useState(false);
  const { getOrderedSlides, currentSlideIndex, reorderSlides } =
    useSlideStore();
  const slides = getOrderedSlides();

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
    reorderSlides(dragIndex, hoverIndex);
  };

  return (
    <aside className="w-72 h-full fixed left-0 top-20 border-r bg-white dark:bg-gray-900 overflow-y-auto">
      <ScrollArea className="h-full w-full">
        {loading ? (
          <div className="w-full px-4 space-y-4 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="p-4 pb-32 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold dark:text-gray-100 text-gray-900">
                SLIDES
              </h2>
              <span className="text-xs font-medium dark:text-gray-400 text-gray-600">
                {slides.length}
              </span>
            </div>
            <div className="space-y-3">
              {slides.map((slide, index) => (
                <div key={slide.id || index}>
                  <SlidePreview
                    slide={slide}
                    index={index}
                    moveSlide={moveSlide}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
});

export default LayoutPreview;

"use client";

import { memo, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import DraggableSlidePreview from "./draggable-slide-preview";
import { useSlideStore } from "@/store/use-slide-store";

interface PresentationLayoutPreviewProps {
  onSlideSelect?: (index: number) => void;
}

const PresentationLayoutPreview = memo(
  ({ onSlideSelect }: PresentationLayoutPreviewProps) => {
    const [loading, setLoading] = useState(false);
    const { getOrderedSlides, currentSlideIndex } = useSlideStore();
    const slides = getOrderedSlides();

    return (
      <aside className="w-64 h-full fixed left-0 top-20 border-r bg-white dark:bg-gray-900 overflow-y-auto">
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
                    <DraggableSlidePreview
                      slide={slide}
                      index={index}
                      isSelected={index === currentSlideIndex}
                      onClick={() => onSlideSelect?.(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </aside>
    );
  }
);

export default PresentationLayoutPreview;

import { useSlideStore } from "@/store/use-slide-store";
import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import DraggableSlidePreview from "./draggable-slide-preview";

type Props = {};

const PresentationLayoutPreview = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const { getOrderedSlides, reorderSlides } = useSlideStore();
  const slides = getOrderedSlides();
  return (
    <div className="w-64 h-full fixed left-0 top-20 border-r overflow-y-auto">
      <ScrollArea className="h-full w-full" suppressHydrationWarning>
        {loading ? (
          <div className="w-full px-4 flex-col space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="p-4 pb-32 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium dark:text-gray-100 text-gray-500">
                SLIDES
              </h2>
              <span
                className="text-xs dark:text-gray-200 text-gary-400"
                suppressHydrationWarning
              >
                {slides.length} Slides
              </span>
            </div>
            {/* TODO */}
            {/* {slides.map((slide, index) => {
              return (
                <DraggableSlidePreview
                  key={slide.id || index}
                  slide={slide}
                  index={index}
                  moveSlide={moveSlide}
                />
              );
            })} */}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
export default PresentationLayoutPreview;

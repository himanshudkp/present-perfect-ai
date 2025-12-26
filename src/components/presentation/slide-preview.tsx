"use client";

import { memo, useRef } from "react";
import { useSlideStore } from "@/store/use-slide-store";
import { cn } from "@/utils";
import type { Slide } from "@/types";
import { useDrag, useDrop } from "react-dnd";
import ScaledPreview from "./scaled-preview";

interface SlidePreviewProps {
  slide: Slide;
  index: number;
  moveSlide: (dragIndex: number, hoverIndex: number) => void;
}

const SlidePreview = memo(({ slide, index, moveSlide }: SlidePreviewProps) => {
  const {
    currentTheme,
    currentSlide,
    setCurrentSlideIndex,
    setCurrentSlide,
    currentSlideIndex,
  } = useSlideStore();
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: "SLIDE",
    item: { index },
    collect: (monitor) => {
      return { isDragging: monitor.isDragging() };
    },
  });

  const [, drop] = useDrop({
    accept: "SLIDE",
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveSlide(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cn(
        "relative cursor-pointer group",
        index === currentSlideIndex
          ? "before:bg-blue-500"
          : "before:bg-transparent",
        isDragging ? "opacity-50" : "opacity-100"
      )}
      onClick={() => setCurrentSlideIndex(index)}
    >
      <div className="pl-5 mb-4 relative">
        <ScaledPreview
          slide={slide}
          isActive={index === currentSlide}
          index={index}
        />
      </div>
    </div>
  );
});

export default SlidePreview;

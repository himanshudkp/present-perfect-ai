"use client";

import { memo } from "react";
import { useSlideStore } from "@/store/use-slide-store";
import { cn } from "@/utils";
import type { Slide } from "@/types";

interface DraggableSlidePreviewProps {
  slide: Slide;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
}

const DraggableSlidePreview = memo(
  ({
    slide,
    index,
    isSelected = false,
    onClick,
  }: DraggableSlidePreviewProps) => {
    const { currentTheme } = useSlideStore();

    return (
      <div
        onClick={onClick}
        className={cn(
          "aspect-video rounded-md overflow-hidden cursor-pointer transition-all duration-200",
          "border-2 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md",
          isSelected
            ? "border-blue-500 ring-2 ring-blue-300"
            : "border-gray-200 dark:border-gray-700"
        )}
        style={{ backgroundImage: currentTheme.gradientBgColor }}
      >
        <div className="w-full h-full p-3 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Slide {index + 1}
          </span>
        </div>
      </div>
    );
  }
);

export default DraggableSlidePreview;

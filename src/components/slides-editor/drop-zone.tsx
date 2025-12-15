"use client";

import { memo, type RefObject } from "react";
import { useDrop } from "react-dnd";
import { useSlideStore } from "@/store/use-slide-store";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  index: number;
  parentId: string;
  slideId: string;
}

export const DropZone = memo(({ index, parentId, slideId }: DropZoneProps) => {
  const { addComponentIntoSlide } = useSlideStore();

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: "CONTENT_ITEM",
    drop: (item: {
      type: string;
      componentType: string;
      label: string;
      component: any;
    }) => {
      if (item.type === "component") {
        addComponentIntoSlide(
          slideId,
          { ...item.component, id: crypto.randomUUID() },
          parentId,
          index
        );
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={dropRef as unknown as RefObject<HTMLDivElement>}
      className={cn(
        "h-1 w-full transition-all duration-200 border-b-2",
        isOver && canDrop
          ? "border-blue-500 bg-blue-100 h-8"
          : "border-gray-300",
        "hover:border-blue-400"
      )}
      role="region"
      aria-label="Drop zone for components"
    >
      {isOver && canDrop && (
        <div className="w-full h-full flex items-center justify-center text-xs font-medium text-blue-600">
          ↓ Drop here
        </div>
      )}
    </div>
  );
});

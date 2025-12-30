"use client";

import { memo, type RefObject } from "react";
import { useDrop } from "react-dnd";
import { cn } from "@/utils";
import type { DropItem } from "@/types";

interface PresentationDropZoneProps {
  index: number;
  onDrop: (item: DropItem, dropIndex: number) => void;
  isEditable: boolean;
}

export const PresentationDropZone = memo(
  ({ index, isEditable, onDrop }: PresentationDropZoneProps) => {
    const [{ canDrop, isOver }, dropRef] = useDrop({
      accept: ["SLIDE", "layout"],
      drop: (item: DropItem) => onDrop(item, index),
      canDrop: () => isEditable,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    });

    if (!isEditable) return null;

    return (
      <div
        ref={dropRef as unknown as RefObject<HTMLDivElement>}
        className={cn(
          "h-1 rounded-full transition-all duration-300 my-2",
          isOver && canDrop && "bg-blue-500 h-2 shadow-md",
          canDrop && !isOver && "bg-gray-400",
          !canDrop && "bg-gray-200 opacity-50"
        )}
        role="region"
        aria-label="Drop zone for slides"
      >
        {isOver && canDrop && (
          <div className="h-full flex items-center justify-center text-green-600">
            Drop here...
          </div>
        )}
      </div>
    );
  }
);

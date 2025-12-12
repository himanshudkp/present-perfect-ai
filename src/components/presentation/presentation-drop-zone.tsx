"use client";

import { memo } from "react";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import type { DropItem } from "@/lib/types";

interface PresentationDropZoneProps {
  index: number;
  onDrop: (item: DropItem, dropIndex: number) => void;
  isEditable: boolean;
}

const PresentationDropZone = memo(
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
        // ref={dropRef}
        className={cn(
          "h-1 rounded-full transition-all duration-300 my-2",
          isOver && canDrop ? "bg-blue-500 h-2" : "bg-gray-300",
          canDrop ? "opacity-100" : "opacity-40"
        )}
        role="region"
        aria-label="Drop zone for slides"
      />
    );
  }
);

export default PresentationDropZone;

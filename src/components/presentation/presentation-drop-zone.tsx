import { DropItem, SlidesLayout } from "@/types";
import { cn } from "@/utils/utils";
import React from "react";
import { useDrop } from "react-dnd";

interface PresentationDropZoneProps {
  index: number;
  onDrop: (item: DropItem, dropIndex: number) => void;
  isEditable: boolean;
}

const PresentationDropZone = ({
  index,
  isEditable,
  onDrop,
}: PresentationDropZoneProps) => {
  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: ["SLIDES", "layout"],
    drop: (item: DropItem) => {
      onDrop(item, index);
    },
    canDrop: () => isEditable,
    collect: (monitor) => ({
      isOver: !!monitor.isOver,
      canDrop: !!monitor.canDrop,
    }),
  });

  if (isEditable) null;
  return (
    <div
      className={cn(
        "h-4 rounded-md transition-all duration-300",
        isOver && canDrop ? "border-green-500 bg-green-100" : "border-gray-300",
        canDrop ? "border-blue-300" : ""
      )}
    >
      {isOver && canDrop && (
        <div className="h-full flex items-center justify-center text-green-600">
          Drop Here
        </div>
      )}
    </div>
  );
};

export default PresentationDropZone;

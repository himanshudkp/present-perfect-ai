import type { SlidesLayout } from "@/types";
import { cn } from "@/utils";
import React from "react";

interface PreviewItemProps {
  name: string;
  Icon: React.FC;
  onClick?: () => void;
  isSelected?: boolean;
  component?: SlidesLayout;
  type: string;
}

const PreviewItem = ({
  Icon,
  name,
  component,
  isSelected,
  onClick,
}: PreviewItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center cursor-grab active:cursor-grabbing gap-2 p-2 rounded-lg hover:bg-primary-10 transition-all duration-200 text-center w-full hover:scale-105 transform",
        isSelected && "ring-2 ring-blue-500"
      )}
    >
      <div className="w-full aspect-video rounded-md border bg-gray-100 dark:bg-gray-700 p-2 shadow-sm hover:shadow-md transition-shadow duration-200">
        <Icon />
      </div>
      <span className="text-xs text-gray-500 font-medium">{name}</span>
    </button>
  );
};

export default PreviewItem;

"use client";

import { useSlideStore } from "@/store/use-slide-store";
import { ContentItem, Slide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { isDragging } from "framer-motion";
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import ContentRenderer, { RecursiveComponent } from "./content-renderer";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { EllipsisVertical, Trash2 } from "lucide-react";

interface DraggableSlideProps {
  slide: Slide;
  index: number;
  moveSlide: (dragIndex: number, hoverIndex: number) => void;
  handleDelete: (id: string) => void;
  isEditable: boolean;
}

const DraggableSlide = ({
  handleDelete,
  index,
  isEditable,
  moveSlide,
  slide,
}: DraggableSlideProps) => {
  const ref = useRef(null);
  const { currentSlide, setCurrentSlide, currentTheme, updateCurrentSlide } =
    useSlideStore();
  const [{ isDragging }, drag] = useDrag({
    type: "SLIDE",
    item: {
      index,
      type: "SLIDE",
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditable,
  });

  const onContentChange = (
    contentId: string,
    newContent:
      | ContentItem
      | string
      | string[]
      | string[][]
      | ContentItem[]
      | (string | ContentItem)[]
  ) => {
    console.log("Content changed", slide.id, contentId, newContent);
    updateCurrentSlide(slide.id, newContent, contentId);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "w-full rounded-lg shadow-lg p-0 min-h[400px] mz-h-[800px]",
        "shadow-xl transition-shadow duration-300",
        "flex flex-col",
        index === currentSlide ? "ring-2 ring-blue-500 ring-offset-2" : "",
        slide.className,
        isDragging ? "opacity-50" : "opacity-100"
      )}
      style={{ backgroundImage: currentTheme.gradientBgColor }}
      onClick={() => setCurrentSlide(index)}
    >
      <div className="h-full w-full grow overflow-hidden">
        <RecursiveComponent
          content={slide.content}
          isPreview={false}
          slideId={slide.id}
          isEditable={isEditable}
          onContentChange={onContentChange}
        />
      </div>
      {isEditable && (
        <Popover>
          <PopoverTrigger asChild className="absolute top-2 left-2">
            <Button size={"sm"} variant={"outline"}>
              <EllipsisVertical className="w-5 h-5" />
              Slide Options
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-0">
            <div className="flex space-x-2">
              <Button variant={"ghost"} onClick={() => handleDelete(slide.id)}>
                <Trash2 className="w-5 h-5 text-red-500" />
                <span className="sr-only">Delete Slide</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DraggableSlide;

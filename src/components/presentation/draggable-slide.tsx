"use client";

import { memo, useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { EllipsisVertical, Trash2, Copy } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { RecursiveComponent } from "./recursive-component";
import { ContentItem, Slide } from "@/types";
import { useSlideStore } from "@/store/use-slide-store";
import { cn } from "@/utils";

interface DraggableSlideProps {
  slide: Slide;
  index: number;
  moveSlide: (dragIndex: number, hoverIndex: number) => void;
  handleDelete: (id: string) => void;
  handleDuplicate?: (id: string) => void;
  isEditable: boolean;
}

const DraggableSlide = memo(
  ({
    handleDelete,
    handleDuplicate,
    index,
    isEditable,
    moveSlide,
    slide,
  }: DraggableSlideProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { currentSlide, setCurrentSlide, currentTheme, updateCurrentSlide } =
      useSlideStore();

    const [{ isDragging }, drag] = useDrag({
      type: "SLIDE",
      item: { index, type: "SLIDE" },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
      canDrag: isEditable,
    });

    const [_, drop] = useDrop({
      accept: ["SLIDE", "LAYOUT"],
      hover(item: { index: number; type: string }) {
        if (!ref.current || !isEditable) return;
        if (item.type === "SLIDE") {
          if (item.index === index) return;
          moveSlide(item.index, index);
          item.index = index;
        }
      },
    });

    if (isEditable) {
      drag(drop(ref));
    }

    const handleContentChange = useCallback(
      (
        contentId: string,
        newContent:
          | ContentItem
          | string
          | string[]
          | string[][]
          | ContentItem[]
          | (string | ContentItem)[]
      ) => {
        updateCurrentSlide(slide.id, newContent, contentId);
      },
      [slide.id, updateCurrentSlide]
    );

    const isCurrentSlide = index === currentSlide;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full rounded-lg shadow-lg p-6 min-h-[400px] max-h-[800px]",
          "shadow-xl transition-all duration-300 flex flex-col",
          isCurrentSlide ? "ring-2 ring-blue-500 ring-offset-2" : "",
          slide.className,
          isDragging ? "opacity-50" : "opacity-100",
          isEditable ? "cursor-grab active:cursor-grabbing" : ""
        )}
        style={{ backgroundImage: currentTheme.gradientBgColor }}
        onClick={() => setCurrentSlide(index)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setCurrentSlide(index);
          }
        }}
      >
        <div className="h-full w-full flex-1 overflow-auto">
          <RecursiveComponent
            content={slide.content}
            isPreview={false}
            slideId={slide.id}
            isEditable={isEditable}
            onContentChange={handleContentChange}
          />
        </div>

        {isEditable && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                aria-label="Slide options menu"
              >
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-1">
              <div className="flex flex-col gap-1">
                {handleDuplicate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicate(slide.id)}
                    className="justify-start"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(slide.id)}
                  className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  }
);

export default DraggableSlide;

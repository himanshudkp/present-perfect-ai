import { useSlideStore } from "@/store/use-slide-store";
import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import PresentationDropZone from "./presentation-drop-zone";
import { DropItem } from "@/types";
import DraggableSlide from "./draggable-slide";

const PresentationEditor = ({ isEditable }: { isEditable: boolean }) => {
  const [loading, setLoading] = useState(false);
  const {
    getOrderedSlides,
    reorderSlides,
    slides,
    project,
    addSlide,
    deleteSlide,
    currentSlideIndex,
    setCurrentSlideIndex,
  } = useSlideStore();

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const orderedSlides = getOrderedSlides();

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
    if (isEditable) {
      reorderSlides(dragIndex, hoverIndex);
    }
  };

  const handleDrop = (item: DropItem, dropIndex: number) => {
    if (!isEditable) return;
    if (item.type === "layout") {
      addSlide(
        {
          ...item.component,
          id: crypto.randomUUID(),
          slideOrder: dropIndex,
        },
        dropIndex
      );
    } else if (item.type === "SLIDE" && item.index !== undefined) {
      moveSlide(item.index, dropIndex);
    }
  };

  useEffect(() => {
    const currentSlide = slideRefs.current[currentSlideIndex];
    if (currentSlide) {
      currentSlide?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentSlideIndex]);

  return (
    <div className="flex-1 flex flex-col h-full max-w-3xl mx-auto px-4 mb-20">
      {loading ? (
        <div className="w-full px-4 flex flex-col space-y-6">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
        </div>
      ) : (
        <ScrollArea className="flex-1 mt-8 ">
          {isEditable && (
            <PresentationDropZone
              index={0}
              isEditable={isEditable}
              onDrop={handleDrop}
            />
          )}
          {orderedSlides.map((slide, index) => {
            return (
              <DraggableSlide
                key={slide.id || index}
                index={index}
                handleDelete={() => {}}
                isEditable={isEditable}
                moveSlide={moveSlide}
                slide={slide}
              />
            );
          })}
        </ScrollArea>
      )}
    </div>
  );
};

export default PresentationEditor;

"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { PresentationDropZone } from "./presentation-drop-zone";
import DraggableSlide from "./draggable-slide";
import { useSlideStore } from "@/store/use-slide-store";
import type { DropItem } from "@/lib/types";

interface PresentationEditorProps {
  isEditable: boolean;
}

const PresentationEditor = memo(({ isEditable }: PresentationEditorProps) => {
  const [loading, setLoading] = useState(true);
  const {
    getOrderedSlides,
    reorderSlides,
    slides,
    addSlide,
    deleteSlide,
    currentSlideIndex,
    setCurrentSlideIndex,
  } = useSlideStore();

  const slideRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const orderedSlides = getOrderedSlides();

  const moveSlide = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (isEditable && dragIndex !== hoverIndex) {
        reorderSlides(dragIndex, hoverIndex);
      }
    },
    [isEditable, reorderSlides]
  );

  const handleDrop = useCallback(
    (item: DropItem, dropIndex: number) => {
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
    },
    [isEditable, addSlide, moveSlide]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (isEditable) {
        deleteSlide(id);
      }
    },
    [isEditable, deleteSlide]
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      const slideToClone = orderedSlides.find((s) => s.id === id);
      if (slideToClone && isEditable) {
        const index = orderedSlides.findIndex((s) => s.id === id);
        addSlide(
          {
            ...slideToClone,
            id: crypto.randomUUID(),
            slideOrder: index + 1,
          },
          index + 1
        );
      }
    },
    [orderedSlides, isEditable, addSlide]
  );

  useEffect(() => {
    const currentSlideEl = slideRefs.current.get(
      orderedSlides[currentSlideIndex]?.id
    );
    if (currentSlideEl) {
      currentSlideEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentSlideIndex, orderedSlides]);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-full max-w-3xl mx-auto px-4 mb-20 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full max-w-3xl mx-auto px-4 mb-20">
      <ScrollArea className="flex-1 mt-8">
        {/* {isEditable && (
          <PresentationDropZone
            index={0}
            isEditable={isEditable}
            onDrop={handleDrop}
          />
        )} */}
        <div className="space-y-6 pr-4">
          {orderedSlides.map((slide, index) => (
            <div
              key={slide.id}
              ref={(el) => {
                if (el) slideRefs.current.set(slide.id, el);
              }}
            >
              {isEditable && (
                <PresentationDropZone
                  index={index + 1}
                  isEditable={isEditable}
                  onDrop={handleDrop}
                />
              )}
              <DraggableSlide
                index={index}
                handleDelete={handleDelete}
                handleDuplicate={handleDuplicate}
                isEditable={isEditable}
                moveSlide={moveSlide}
                slide={slide}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});

export default PresentationEditor;

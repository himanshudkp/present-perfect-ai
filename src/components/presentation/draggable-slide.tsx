import { useSlideStore } from "@/store/use-slide-store";
import { Slide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { isDragging } from "framer-motion";
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import MasterRecursiveComponent from "./master-recursive-component";

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
        <MasterRecursiveComponent />
      </div>
    </div>
  );
};

export default DraggableSlide;

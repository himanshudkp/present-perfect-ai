"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { SLIDE_ANIMATIONS } from "@/lib/constants";

interface SlideDragHandleProps {
  isVisible: boolean;
  dragHandlers?: { attributes?: any; listeners?: any };
}

export const SlideDragHandle = memo(
  ({ isVisible, dragHandlers }: SlideDragHandleProps) => (
    <motion.div
      initial={SLIDE_ANIMATIONS.dragHandle.initial}
      animate={SLIDE_ANIMATIONS.dragHandle.animate(isVisible)}
      transition={SLIDE_ANIMATIONS.dragHandle.transition}
      className="cursor-grab active:cursor-grabbing shrink-0 z-10 flex items-center justify-center"
      {...dragHandlers?.attributes}
      {...dragHandlers?.listeners}
    >
      <GripVertical className="h-5 w-5 text-muted-foreground/70" />
    </motion.div>
  )
);

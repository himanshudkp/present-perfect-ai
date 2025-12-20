"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { SLIDE_ANIMATIONS } from "@/constants";

interface SLideOrderBadgeProps {
  order: number;
  isEditing: boolean;
  isSelected: boolean;
}

export const SLideOrderBadge = memo(
  ({ order, isEditing, isSelected }: SLideOrderBadgeProps) => (
    <motion.div
      layout
      className={cn(
        "shrink-0 flex items-center justify-center rounded-lg font-bold transition-all duration-200 pointer-events-none",
        isEditing
          ? "h-10 w-10 bg-primary text-primary-foreground text-base shadow-lg"
          : isSelected
          ? "h-10 w-10 bg-primary text-primary-foreground text-base shadow-md"
          : "h-9 w-9 bg-muted text-muted-foreground text-sm"
      )}
      {...SLIDE_ANIMATIONS.orderBadge}
    >
      {order}
    </motion.div>
  )
);

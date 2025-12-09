"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const ANIMATION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.2 },
} as const;

const EmptyOutline = ({ onAddCard }: { onAddCard: () => void }) => {
  return (
    <div
      key="empty-state"
      className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/20"
    >
      <Plus className="h-12 w-12 text-muted-foreground/30 mb-3" />
      <p className="text-base font-medium text-muted-foreground mb-1">
        No slides yet
      </p>
      <p className="text-sm text-muted-foreground/60">
        Add your first slide to get started
      </p>
      <motion.button
        initial={ANIMATION.initial}
        animate={ANIMATION.animate}
        transition={ANIMATION.transition}
        onClick={() => onAddCard()}
        className="w-full py-4 rounded-xl border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200 text-sm font-medium text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
      >
        <Plus className="h-5 w-5" />
        Add Your First Slide
      </motion.button>
    </div>
  );
};

export default memo(EmptyOutline);

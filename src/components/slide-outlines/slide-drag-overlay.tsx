"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { DragOverlay } from "@dnd-kit/core";
import type { OutlineCard } from "@/types";

const ANIMATION = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1.05, opacity: 1 },
  transition: { type: "spring", damping: 20, stiffness: 300 },
} as const;

const DROP_ANIMATION = { duration: 150 } as const;

const SlideDragOverlay = ({
  activeCard,
  activeId,
}: {
  activeId: string | null;
  activeCard: OutlineCard | null;
}) => {
  return (
    <DragOverlay dropAnimation={DROP_ANIMATION}>
      {activeId && activeCard ? (
        <motion.div
          className="pointer-events-none w-full "
          initial={ANIMATION.initial}
          animate={ANIMATION.animate}
          transition={ANIMATION.transition}
        >
          <div className="bg-background border-2 border-primary rounded-xl p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                {activeCard.order}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-primary truncate">
                  {activeCard.title}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </DragOverlay>
  );
};

export default memo(SlideDragOverlay);

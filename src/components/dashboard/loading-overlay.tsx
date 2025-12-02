"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

interface LoadingOverlayProps {
  isDeleted?: boolean;
}

export const LoadingOverlay = memo(({ isDeleted }: LoadingOverlayProps) => (
  <motion.div
    variants={overlayVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="absolute inset-0 grid place-items-center rounded-xl 
               bg-background/90 backdrop-blur-sm"
  >
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span className="text-xs font-medium opacity-90">
        {isDeleted ? "Recovering..." : "Deleting..."}
      </span>
    </div>
  </motion.div>
));

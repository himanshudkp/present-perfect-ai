"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SLideHelpText = memo(({ isVisible }: { isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md border shadow-sm pointer-events-none"
      >
        Double-click to edit
      </motion.div>
    )}
  </AnimatePresence>
));

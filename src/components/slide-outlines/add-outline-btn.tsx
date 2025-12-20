"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/utils";

const VARIANTS = {
  default: {
    lineWidth: "40%",
    buttonSize: "h-8 w-8",
    iconSize: "h-4 w-4",
    hoverHeight: "2rem",
  },
  minimal: {
    lineWidth: "30%",
    buttonSize: "h-7 w-7",
    iconSize: "h-3.5 w-3.5",
    hoverHeight: "1.75rem",
  },
} as const;

const GAP_GROUP_VARIANTS = {
  collapsed: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 },
  },
  expanded: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      staggerChildren: 0.05,
    },
  },
};

const LINE_VARIANTS = {
  collapsed: { scaleX: 0 },
  expanded: {
    scaleX: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
} as const;

const ICON_VARIANTS = {
  collapsed: { scale: 0, rotate: -180 },
  expanded: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
} as const;

const TOOLTIP_VARIANTS = {
  collapsed: { opacity: 0, x: -10 },
  expanded: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};

interface AddOutlineButtonProps {
  onAddCard: () => void;
  label?: string;
  variant?: "default" | "minimal";
}

const AddOutlineButton = ({
  onAddCard,
  label = "Add Slide",
  variant = "default",
}: AddOutlineButtonProps) => {
  const [showGap, setShowGap] = useState(false);
  const config = useMemo(() => VARIANTS[variant], [variant]);

  const handleClick = useCallback(() => {
    onAddCard();
  }, [onAddCard]);

  return (
    <motion.div
      className="w-full relative overflow-visible group"
      initial={{ height: "0.5rem" }}
      animate={{
        height: showGap ? config.hoverHeight : "0.5rem",
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      onPointerEnter={() => setShowGap(true)}
      onPointerLeave={() => setShowGap(false)}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: showGap ? 0 : 0.2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-full h-px bg-border/50" />
      </motion.div>

      <AnimatePresence mode="popLayout">
        {showGap && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-2"
            variants={GAP_GROUP_VARIANTS}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            <motion.div
              variants={LINE_VARIANTS}
              className="origin-right"
              style={{ width: config.lineWidth }}
            >
              <div className="h-px bg-linear-to-r from-transparent via-primary to-primary" />
            </motion.div>

            <motion.div
              variants={ICON_VARIANTS}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                aria-label={label}
                className={cn(
                  "rounded-full p-0 bg-primary hover:bg-primary/90 border-primary hover:border-primary/90 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group/btn",
                  config.buttonSize
                )}
              >
                <Plus
                  className={cn(
                    "text-primary-foreground dark:text-primary transition-transform group-hover/btn:rotate-90",
                    config.iconSize
                  )}
                />
              </Button>
            </motion.div>

            <motion.div
              variants={LINE_VARIANTS}
              className="origin-left"
              style={{ width: config.lineWidth }}
            >
              <div className="h-px bg-linear-to-l from-transparent via-primary to-primary" />
            </motion.div>

            <motion.span
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-xs text-muted-foreground whitespace-nowrap bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border shadow-sm"
              variants={TOOLTIP_VARIANTS}
            >
              {label}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(AddOutlineButton);

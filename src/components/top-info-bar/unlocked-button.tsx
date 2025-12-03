"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

interface UnlockedButtonProps {
  isHovering: boolean;
  onClick: () => void;
}

const SHIMMER_VARIANTS = {
  initial: { x: "-100%" },
  animate: { x: "100%" },
} as const;

const TRANSITION = {
  PARENT: { duration: 0.6, ease: "easeInOut" },
  NEW_PROJECT_PARENT: { type: "spring", stiffness: 300, damping: 20 },
  NEW_PROJECT_CHILD: { duration: 0.4, ease: "easeInOut" },
} as const;

const UnlockedButton = ({ isHovering, onClick }: UnlockedButtonProps) => {
  const sparkleVariants = (i: number) => ({
    initial: { x: "50%", y: "50%", scale: 0, opacity: 0 },
    animate: {
      x: `${50 + (i - 1) * 30}%`,
      y: `${30 - i * 10}%`,
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
    },
  });

  return (
    <Button
      size="lg"
      onClick={onClick}
      className={cn(
        "rounded-xl font-semibold gap-2 relative overflow-hidden group bg-linear-to-r from-primary to-primary/90 hover:from-primary hover:to-primary text-primary-foreground shadow-lg transition-all duration-300",
        isHovering && "shadow-xl shadow-primary/40"
      )}
      aria-label="Create a new presentation"
    >
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
            variants={SHIMMER_VARIANTS}
            initial="initial"
            animate="animate"
            exit="animate"
            transition={TRANSITION.PARENT}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="flex items-center gap-2 relative z-10"
        animate={{ x: isHovering ? 2 : 0 }}
        transition={TRANSITION.NEW_PROJECT_PARENT}
      >
        <motion.div
          animate={{ rotate: isHovering ? [0, 90, 0] : 0 }}
          transition={TRANSITION.NEW_PROJECT_CHILD}
        >
          <Plus className="h-5 w-5" />
        </motion.div>
        <span>Create With AI</span>
      </motion.div>

      <AnimatePresence>
        {isHovering && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute pointer-events-none"
                variants={sparkleVariants(i)}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                <Sparkles className="h-3 w-3 text-primary-foreground/60" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
        }}
      />
    </Button>
  );
};

export default memo(UnlockedButton);

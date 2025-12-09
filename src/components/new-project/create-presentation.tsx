"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
} as const;

interface CreatePresentationProps {
  isVisible: boolean;
  isReady: boolean;
  isCreating: boolean;
  onCreateClick: () => void;
}

export const CreatePresentation = memo(
  ({
    isVisible,
    isReady,
    isCreating,
    onCreateClick,
  }: CreatePresentationProps) => {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={ANIMATION.initial}
            animate={ANIMATION.animate}
            exit={ANIMATION.exit}
            className="bg-linear-to-t from-background via-background to-transparent pt-6 pb-4 px-4 sm:px-6 lg:px-8 z-40 border-t"
          >
            <div className="max-w-7xl mx-auto">
              <Button
                onClick={onCreateClick}
                disabled={!isReady || isCreating}
                className="w-full font-semibold text-base gap-2 bg-linear-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl h-12 sm:h-14"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Presentation...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Create Presentation
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

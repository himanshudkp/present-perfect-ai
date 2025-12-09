"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecentPromptsList from "./recent-prompts-list";
import NewProjectCard from "./new-project-card";
import { usePromptStore } from "@/store/use-prompt-store";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "@/lib/constants";

const ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
} as const;

const BackgroundDecor = memo(() => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
  </div>
));

const NewProjectPage = memo(
  ({ onSelectOption }: { onSelectOption: (option: string) => void }) => {
    const prompts = usePromptStore((s) => s.prompts);

    return (
      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
        className="flex min-h-screen flex-col items-center justify-center gap-10 p-5 sm:p-8 relative overflow-hidden"
      >
        <BackgroundDecor />

        <motion.div
          variants={ITEM_VARIANTS}
          className="text-center space-y-6 max-w-4xl"
        >
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              How would you like to
              <br />
              <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                get started?
              </span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Choose your preferred method and create stunning presentations in
              minutes
            </p>
          </div>
        </motion.div>

        <NewProjectCard onSelectOption={onSelectOption} />

        <AnimatePresence>
          {prompts.length > 0 && (
            <motion.div
              initial={ANIMATION.initial}
              animate={ANIMATION.animate}
              exit={ANIMATION.exit}
              variants={ITEM_VARIANTS}
              className="w-full max-w-6xl"
            >
              <RecentPromptsList />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

export default NewProjectPage;

"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePromptStore } from "@/store/use-prompt-store";
import CreatePage from "./create-page";
import CreateFromScratch from "./create-from-scratch";
import CreateWithAI from "./create-with-ai";
import NewProjectSkeleton from "@/components/new-project-skeleton";
import type { Page } from "@/types";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const RenderPage = ({ mode }: { mode: Page }) => {
  const { page, setPage } = usePromptStore();
  const [isLoading, setIsLoading] = useState(true);
  const [displayPage, setDisplayPage] = useState(page);

  const handleSelectOption = useCallback(
    (option: string) => {
      setPage(option as any);
    },
    [setPage]
  );

  useEffect(() => {
    if (page === displayPage) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      setDisplayPage(page);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [page, displayPage]);

  const handleBack = useCallback(() => {
    setPage("create");
  }, [setPage]);

  const renderStep = useMemo(() => {
    const pageComponents = {
      create: <CreatePage onSelectOption={handleSelectOption} />,
      "creative-ai": <CreateWithAI onBack={handleBack} />,
      "create-from-scratch": <CreateFromScratch onBack={handleBack} />,
    };

    return (
      pageComponents[displayPage as keyof typeof pageComponents] || (
        <CreatePage onSelectOption={handleSelectOption} />
      )
    );
  }, [displayPage, handleSelectOption]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <NewProjectSkeleton />
      </motion.div>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full"
        >
          {renderStep}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default React.memo(RenderPage);

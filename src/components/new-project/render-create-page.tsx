"use client";

import { useCallback, useEffect, useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewProjectPage from "./new-project-page";
import CreateFromScratch from "./create-from-scratch";
import CreateWithAI from "./create-with-ai";
import NewProjectSkeleton from "@/components/new-project/new-project-skeleton";
import { usePromptStore } from "@/store/use-prompt-store";

const PAGE_VARIANTS = {
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

const RenderCreatePage = () => {
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
      create: <NewProjectPage onSelectOption={handleSelectOption} />,
      "creative-ai": <CreateWithAI onBack={handleBack} />,
      "create-from-scratch": <CreateFromScratch onBack={handleBack} />,
    };

    return (
      pageComponents[displayPage as keyof typeof pageComponents] || (
        <NewProjectPage onSelectOption={handleSelectOption} />
      )
    );
  }, [displayPage, handleSelectOption]);

  if (isLoading) {
    return <NewProjectSkeleton />;
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayPage}
          variants={PAGE_VARIANTS}
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

export default memo(RenderCreatePage);

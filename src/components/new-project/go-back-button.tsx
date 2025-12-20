"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { ITEM_VARIANTS } from "@/constants";

const GoBackButton = ({
  handleBack,
  isCreating,
}: {
  isCreating: boolean;
  handleBack: () => void;
}) => {
  return (
    <motion.button
      variants={ITEM_VARIANTS}
      onClick={handleBack}
      disabled={isCreating}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </motion.button>
  );
};

export default memo(GoBackButton);

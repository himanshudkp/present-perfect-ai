"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { NewProjectItem } from "./new-project-item";
import { CREATE_PAGE_CARD } from "@/lib/constants";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

const NewProjectCard = memo(
  ({ onSelectOption }: { onSelectOption: (type: string) => void }) => {
    return (
      <motion.div
        className="w-full"
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CREATE_PAGE_CARD.map((option, index) => (
            <NewProjectItem
              key={option.type}
              option={option}
              index={index}
              onSelectOption={onSelectOption}
            />
          ))}
        </div>
      </motion.div>
    );
  }
);

export default NewProjectCard;

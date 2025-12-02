import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/utils";
import { Button } from "./ui/button";
import RecentPrompts from "./recent-prompts";
import { usePromptStore } from "@/store/use-prompt-store";
import {
  CONTAINER_VARIANTS,
  CREATE_PAGE_CARD,
  ITEM_VARIANTS,
} from "@/utils/constants";
import ComparisonGuide from "./comparison-guide";
import {
  Sparkles,
  Zap,
  TrendingUp,
  ChevronRight,
  Star,
  Clock,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "./ui/card";
import NewProjectCard from "./new-project-card";

const cardHoverVariants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.03,
    y: -8,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
} as const;

const iconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: 360, scale: 1.1 },
};

type Props = {
  onSelectOption: (option: string) => void;
};

const CreatePage = ({ onSelectOption }: Props) => {
  const { prompts } = usePromptStore();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const stats = [
    {
      icon: Zap,
      label: "Fast Creation",
      value: "< 2 min",
      color: "text-yellow-500",
    },
    {
      icon: Star,
      label: "Quality",
      value: "Premium",
      color: "text-purple-500",
    },
    {
      icon: Users,
      label: "Users",
      value: "10K+",
      color: "text-blue-500",
    },
  ];

  return (
    <motion.div
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      className="flex min-h-screen flex-col items-center justify-center gap-10 p-5 sm:p-8 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header Section */}
      <motion.div
        variants={ITEM_VARIANTS}
        className="text-center space-y-6 max-w-4xl"
      >
        {/* Main Title */}
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

      {/* Cards Grid */}
      {/* <motion.div
        variants={containerVariants}
        className="grid w-full max-w-6xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
      > */}
      <NewProjectCard onSelectOption={onSelectOption} />
      {/* </motion.div> */}

      {/* Help Section */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Average creation time: 2-5 minutes</span>
      </div>

      {/* Recent Prompts Section */}
      <AnimatePresence>
        {prompts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            variants={ITEM_VARIANTS}
            className="w-full max-w-6xl"
          >
            <RecentPrompts />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Guide Modal */}
      <AnimatePresence>
        {showGuide && <ComparisonGuide onClose={() => setShowGuide(false)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreatePage;

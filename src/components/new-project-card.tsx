"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, TrendingUp, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/utils";
import { useState } from "react";
import type { Page } from "@/types";

type CreateOption = {
  title: string;
  highlightedText: string;
  description: string;
  type: Page;
  highlight?: boolean;
};

const CREATE_PAGE_CARD: CreateOption[] = [
  {
    title: "Use a ",
    highlightedText: "Template",
    description: "Choose from professional templates and customize.",
    type: "templates",
  },
  {
    title: "Generate with ",
    highlightedText: "Creative AI",
    description: "Let AI create your entire presentation instantly.",
    type: "creative-ai",
    highlight: true,
  },
  {
    title: "Start from ",
    highlightedText: "Scratch",
    description: "Build your presentation from the ground up.",
    type: "create-from-scratch",
  },
];

const NewProjectCard = ({
  onSelectOption,
}: {
  onSelectOption: (type: string) => void;
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  } as const;

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CREATE_PAGE_CARD.map((option, index) => {
          const isHovered = hoveredCard === option.type;
          const highlight = option.highlight || false;

          return (
            <motion.div
              key={option.type}
              variants={cardVariants}
              className={cn(
                "relative group overflow-hidden rounded-xl p-4",
                "border-2 transition-all duration-300",
                "hover:shadow-md h-full flex flex-col",
                highlight
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/40 hover:bg-muted/50"
              )}
              onMouseEnter={() => setHoveredCard(option.type)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered && highlight ? 0.08 : 0 }}
                className="absolute inset-0 bg-linear-to-r from-primary via-primary/50 to-transparent pointer-events-none"
              />

              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "100%" : "-100%" }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none"
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-5">
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                      rotate: isHovered ? [0, -8, 8, 0] : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm",
                      highlight &&
                        "bg-linear-to-br from-primary to-purple-600 text-white",
                      isHovered &&
                        option.type !== "creative-ai" && [
                          "bg-primary text-primary-foreground shadow-lg scale-110",
                        ],
                      !highlight &&
                        !(isHovered && option.type !== "creative-ai") && [
                          "bg-muted text-muted-foreground",
                        ]
                    )}
                  >
                    {option.type === "creative-ai" ? (
                      <Brain className="h-4 w-4 " />
                    ) : (
                      index + 1
                    )}
                  </motion.div>

                  {highlight && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <Badge className="text-xs gap-1 bg-linear-to-r from-primary to-purple-600 text-white">
                        <Star className="h-4 w-4 fill-current" />
                      </Badge>

                      <Badge variant="default" className="text-xs gap-1">
                        <TrendingUp className="h-3 w-3" />
                      </Badge>
                    </motion.div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-sm sm:text-base mb-1">
                    {option.title}
                    <motion.span
                      animate={{
                        backgroundPosition: isHovered
                          ? "200% center"
                          : "0% center",
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: isHovered ? Infinity : 0,
                      }}
                      className="bg-linear-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent  text-3xl"
                      style={{ backgroundSize: "200% auto" }}
                    >
                      {option.highlightedText}
                    </motion.span>
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                    {option.description}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-4 pt-3 border-t border-border/50"
                >
                  <Button
                    onClick={() => onSelectOption(option.type)}
                    variant={highlight ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "w-full gap-2 rounded-lg font-medium",
                      highlight &&
                        "shadow-md bg-linear-to-r from-primary to-purple-600 hover:from-primary hover:to-purple-700"
                    )}
                  >
                    <span>{highlight ? "Generate Now" : "Continue"}</span>
                    <motion.span
                      animate={{ x: isHovered ? 3 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </motion.div>
              </div>

              <AnimatePresence>
                {isHovered && highlight && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-primary/10 blur-xl"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NewProjectCard;

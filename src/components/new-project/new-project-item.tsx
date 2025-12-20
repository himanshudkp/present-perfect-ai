"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChevronRight, Star, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/utils";
import type { CreateOption } from "@/types";

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
} as const;

const SHINE_VARIANTS = {
  initial: { x: "-100%" },
  hover: { x: "100%" },
} as const;

interface NewProjectItemProps {
  option: CreateOption;
  index: number;
  onSelectOption: (type: string) => void;
}

export const NewProjectItem = memo(
  ({ option, index, onSelectOption }: NewProjectItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { highlight, type, title, highlightedText, description } = option;

    const isCreativeAI = type === "creative-ai";
    const iconBgClass = useMemo(() => {
      if (highlight)
        return "bg-linear-to-br from-primary to-purple-600 text-white";
      return isHovered
        ? "bg-primary text-primary-foreground shadow-lg"
        : "bg-muted text-muted-foreground";
    }, [highlight, isHovered]);

    const onMouseEnter = useCallback(() => setIsHovered(true), []);
    const onMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
      <motion.div
        variants={CARD_VARIANTS}
        className={cn(
          "relative group overflow-hidden rounded-xl p-4 h-full flex flex-col border-2 transition-all duration-300",
          highlight
            ? "border-primary bg-primary/5 shadow-md"
            : "border-border hover:border-primary/40 hover:bg-muted/50"
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {highlight && (
          <motion.div
            animate={{ opacity: isHovered ? 0.08 : 0 }}
            className="absolute inset-0 bg-linear-to-r from-primary via-primary/50 to-transparent pointer-events-none"
            transition={{ duration: 0.2 }}
          />
        )}

        <motion.div
          variants={SHINE_VARIANTS}
          animate={isHovered ? "hover" : "initial"}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none"
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-5">
            <motion.div
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 8 : 0,
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm",
                iconBgClass
              )}
            >
              {isCreativeAI ? <Brain className="h-4 w-4" /> : index + 1}
            </motion.div>

            {highlight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Badge
                  variant={"secondary"}
                  className="text-xs gap-1 bg-linear-to-r from-primary to-purple-600 text-white"
                >
                  <Star className="h-4 w-4 fill-current" />
                </Badge>
                <Badge variant={"default"} className="text-xs gap-1">
                  <TrendingUp className="h-3 w-3" />
                </Badge>
              </motion.div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-sm sm:text-base mb-1">
              {title}
              {highlightedText && (
                <motion.span
                  animate={{
                    backgroundPosition: isHovered ? "200% center" : "0% center",
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: isHovered ? Infinity : 0,
                  }}
                  className="bg-linear-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent text-3xl"
                  style={{ backgroundSize: "200% auto" }}
                >
                  {highlightedText}
                </motion.span>
              )}
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
              {description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50">
            <Button
              onClick={() => onSelectOption(type)}
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
          </div>
        </div>
      </motion.div>
    );
  }
);

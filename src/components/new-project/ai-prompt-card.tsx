"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles, Edit3, Trash2, FileText } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { cn, getTimeAgo } from "@/utils";
import { ITEM_VARIANTS } from "@/constants";
import type { PromptHistory } from "@/types";

const CARD_HOVER_VARIANTS = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
} as const;

const SHINE_VARIANTS = {
  initial: { x: "-100%" },
  hover: { x: "100%" },
} as const;

interface AIPromptCardProps {
  prompt: PromptHistory;
  index: number;
  isHovered: boolean;
  isDeleting: boolean;
  confirmDelete: boolean;
  viewMode: "grid" | "list";
  onHover: () => void;
  onHoverEnd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const AIPromptCard = memo(
  ({
    prompt,
    index,
    isHovered,
    isDeleting,
    confirmDelete,
    viewMode,
    onHover,
    onHoverEnd,
    onEdit,
    onDelete,
    onDuplicate,
  }: AIPromptCardProps) => {
    const slideCount = prompt.outlines?.length || 0;
    const { id, title, createdAt } = prompt;

    return (
      <motion.div
        key={id}
        variants={ITEM_VARIANTS}
        exit={{ opacity: 0, scale: 0.9, x: -50, transition: { duration: 0.2 } }}
        layout
        onHoverStart={onHover}
        onHoverEnd={onHoverEnd}
      >
        <motion.div variants={CARD_HOVER_VARIANTS} className="h-full">
          <Card
            className={cn(
              "p-5 flex flex-col h-full border-2 rounded-2xl transition-all duration-300 relative group overflow-hidden",
              isHovered && "border-primary shadow-xl",
              isDeleting && "opacity-50 pointer-events-none"
            )}
          >
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                className="absolute inset-0 bg-linear-to-br from-primary via-primary/50 to-transparent pointer-events-none"
              />
            )}

            <div className="flex items-start justify-between mb-3 relative z-10">
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base transition-colors duration-300",
                  isHovered
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </motion.div>

              <Badge variant="secondary" className="gap-1 text-xs">
                <Sparkles className="w-3 h-3" />
                <span className={viewMode === "list" ? "hidden xl:inline" : ""}>
                  AI
                </span>
              </Badge>
            </div>

            <div className="flex-1 mb-4 relative z-10">
              <h3
                className={cn(
                  "font-semibold leading-tight group-hover:text-primary transition-colors mb-3 line-clamp-2",
                  viewMode === "grid" ? "text-xl" : "text-base"
                )}
              >
                {title}
              </h3>

              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{getTimeAgo(createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>{slideCount} slides</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <Button
                variant="default"
                size="sm"
                onClick={() => onEdit(id)}
                className={cn(
                  "flex-1 rounded-xl gap-2 shadow-md",
                  viewMode === "list" && "text-xs px-2"
                )}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className={viewMode === "list" ? "hidden sm:inline" : ""}>
                  Continue
                </span>
              </Button>

              <Button variant={"destructive"} onClick={() => onDelete(id)}>
                <Trash2 className="" />
              </Button>
            </div>

            <motion.div
              variants={SHINE_VARIANTS}
              animate={isHovered ? "hover" : "initial"}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            />
          </Card>
        </motion.div>
      </motion.div>
    );
  }
);

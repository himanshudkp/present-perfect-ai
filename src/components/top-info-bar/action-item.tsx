"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/utils";
import type { Action } from "@/types";

const MOTION_WHILE_HOVER = { x: 2 } as const;
const MOTION_TRANSITION = { duration: 0.15 } as const;

interface ActionItemProps {
  action: Action;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

export const ActionItem = memo(
  ({ action, isSelected, onClick, onMouseEnter }: ActionItemProps) => {
    const Icon = action.icon;
    return (
      <motion.button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
          "hover:bg-accent",
          isSelected && "bg-accent"
        )}
        whileHover={MOTION_WHILE_HOVER}
        transition={MOTION_TRANSITION}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{action.title}</div>
          {action.description && (
            <div className="text-xs text-muted-foreground truncate">
              {action.description}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {action.shortcut && (
            <Badge variant="secondary" className="text-xs font-mono">
              ⌘ {action.shortcut}
            </Badge>
          )}
          {isSelected && (
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </motion.button>
    );
  }
);

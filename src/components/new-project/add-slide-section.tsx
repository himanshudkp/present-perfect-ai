"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Plus, RotateCcw } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/utils";

interface AddSlideSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
  onAddClick: () => void;
  onResetClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  canAdd: boolean;
  disabled?: boolean;
  cardCount: number;
  showResetConfirm?: boolean;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  isManual?: boolean;
}

export const AddSlideSection = memo(
  ({
    title,
    onTitleChange,
    onAddClick,
    onResetClick,
    onKeyDown,
    canAdd,
    disabled = false,
    cardCount,
    showResetConfirm = false,
    placeholder = "E.g., Introduction, Key Features, Conclusion...",
    label = "Add Slides Manually",
    icon = <Plus className="h-4 w-4 text-primary" />,
    isManual = true,
  }: AddSlideSectionProps) => {
    const hasTitle = title.trim().length > 0;

    const resetDisabled = disabled || (!hasTitle && cardCount === 0);

    return (
      <motion.div
        className={cn(
          "p-3 rounded-lg border transition-all duration-200",
          hasTitle
            ? "border-primary/50 bg-primary/5"
            : "border-border/50 bg-muted/30"
        )}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {icon}
            {label}
          </div>

          <div className="flex gap-2">
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="text-sm border-0 focus-visible:ring-1 focus-visible:ring-primary bg-background"
            />

            <Button
              onClick={onAddClick}
              disabled={!canAdd || disabled}
              size="sm"
              className="shrink-0 gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add</span>
            </Button>

            {isManual && (
              <Button
                onClick={onResetClick}
                disabled={resetDisabled}
                variant="outline"
                size="sm"
                className={cn(
                  "shrink-0",
                  showResetConfirm && "border-destructive text-destructive"
                )}
                title={
                  showResetConfirm ? "Click again to confirm" : "Clear all"
                }
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            {cardCount} slide{cardCount !== 1 && "s"} • Press Enter to add
          </p>
        </div>
      </motion.div>
    );
  }
);

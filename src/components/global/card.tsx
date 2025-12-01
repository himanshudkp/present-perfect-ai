"use client";

import { OutlineCard } from "@/types";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card as ShadCNCard } from "@/components/ui/card";
import { cn } from "@/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Trash2,
  GripVertical,
  Check,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Badge } from "../ui/badge";

type Props = {
  card: OutlineCard;
  isEditing: boolean;
  isSelected: boolean;
  isDragging?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  editText: string;
  onEditChange: (value: string) => void;
  onEditBlur: () => void;
  onEditKeyDown: (e: React.KeyboardEvent) => void;
  onCardClick: () => void;
  onCardDoubleClick: () => void;
  onDeleteClick: () => void;
  dragHandlers: {
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
  onDragOver: (e: React.DragEvent) => void;
  dragOverStyles: React.CSSProperties;
  showAIIndicator?: boolean;
  readOnly?: boolean;
};

const Card = ({
  card,
  dragHandlers,
  dragOverStyles,
  editText,
  isEditing,
  isSelected,
  isDragging = false,
  isFirst = false,
  isLast = false,
  onCardClick,
  onCardDoubleClick,
  onDeleteClick,
  onDragOver,
  onEditBlur,
  onEditChange,
  onEditKeyDown,
  showAIIndicator = false,
  readOnly = false,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isHovered) {
      setShowDeleteConfirm(false);
    }
  }, [isHovered]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDeleteClick();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const handleEditConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditBlur();
  };

  const handleEditCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditChange(card.title);
    onEditBlur();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        y: 0,
        scale: isDragging ? 0.98 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95, x: -50, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("w-full relative group", isDragging && "z-50")}
    >
      <ShadCNCard
        draggable={!isEditing && !readOnly}
        onDragStart={dragHandlers.onDragStart}
        onDragEnd={dragHandlers.onDragEnd}
        onDragOver={onDragOver}
        onClick={onCardClick}
        onDoubleClick={onCardDoubleClick}
        style={dragOverStyles}
        className={cn(
          "p-4 transition-all duration-200 relative overflow-hidden",
          !isEditing && !readOnly && "cursor-pointer hover:shadow-lg",
          isSelected &&
            "ring-2 ring-primary border-primary shadow-lg bg-primary/5",
          isEditing && "ring-2 ring-primary/70 shadow-xl bg-background",
          isDragging && "shadow-2xl scale-105 rotate-1 cursor-grabbing",
          !isDragging && !isEditing && !readOnly && "hover:border-primary/50",
          readOnly && "cursor-default opacity-75"
        )}
      >
        <AnimatePresence>
          {(isSelected || isHovered) && !isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              className="absolute left-0 top-0 bottom-0 w-1 bg-primary origin-top"
            />
          )}
        </AnimatePresence>

        {!readOnly && !isEditing && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: isHovered || isDragging ? 1 : 0,
              x: isHovered || isDragging ? 0 : -10,
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground/70" />
          </motion.div>
        )}

        <div
          className={cn(
            "flex items-center gap-3 transition-all duration-200 relative z-10",
            (isHovered || isDragging) && !readOnly && !isEditing && "pl-6"
          )}
        >
          <motion.div
            layout
            className={cn(
              "shrink-0 flex items-center justify-center rounded-xl font-bold transition-all duration-200",
              isEditing
                ? "h-10 w-10 bg-primary text-primary-foreground text-base shadow-lg"
                : isSelected
                ? "h-10 w-10 bg-primary text-primary-foreground text-base shadow-md"
                : "h-9 w-9 bg-muted text-muted-foreground text-sm"
            )}
            whileHover={{ scale: isEditing ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {card.order}
          </motion.div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  value={editText}
                  onChange={(e) => onEditChange(e.target.value)}
                  onBlur={onEditBlur}
                  onKeyDown={onEditKeyDown}
                  className={cn(
                    "text-base sm:text-lg font-medium",
                    "border-2 border-primary focus-visible:ring-primary",
                    "shadow-sm"
                  )}
                  placeholder="Enter slide title..."
                  disabled={readOnly}
                />
                <div className="flex gap-1 shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditConfirm}
                      className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                      title="Save changes"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditCancel}
                      className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <p
                  className={cn(
                    "font-semibold truncate transition-all duration-200 text-wrap",
                    isSelected
                      ? "text-base sm:text-lg"
                      : "text-sm sm:text-base",
                    isSelected && "text-primary"
                  )}
                  title={card.title}
                >
                  {card.title}
                </p>

                {showAIIndicator && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge
                      variant="secondary"
                      className="gap-1 text-xs shrink-0"
                    >
                      <Sparkles className="h-3 w-3" />
                      AI
                    </Badge>
                  </motion.div>
                )}

                <div className="flex gap-1 ml-auto shrink-0">
                  <AnimatePresence>
                    {isFirst && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <Badge variant="outline" className="text-xs">
                          First
                        </Badge>
                      </motion.div>
                    )}
                    {isLast && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <Badge variant="outline" className="text-xs">
                          Last
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {!readOnly && (
            <AnimatePresence>
              {(isHovered || showDeleteConfirm) && !isEditing && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  {showDeleteConfirm ? (
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2 bg-destructive/10 rounded-lg p-2 border border-destructive/20"
                    >
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-xs font-medium text-destructive whitespace-nowrap">
                        Delete?
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleDelete}
                          className="h-7 px-3 text-xs"
                        >
                          Yes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelDelete}
                          className="h-7 px-3 text-xs"
                        >
                          No
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDelete}
                        aria-label={`Delete card ${card.order}`}
                        className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete slide"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-primary/70 to-primary origin-left"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-lg pointer-events-none"
            />
          )}
        </AnimatePresence>
      </ShadCNCard>

      <AnimatePresence>
        {isHovered && !isEditing && !readOnly && !showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md border shadow-sm"
          >
            Double-click to edit
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Card;

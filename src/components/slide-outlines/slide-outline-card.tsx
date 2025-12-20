"use client";

import React, { useRef, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { SlideDragHandle } from "./slide-drag-handle";
import { SLideOrderBadge } from "./slide-order-badge";
import { SlideOutlineEditor } from "./slide-outline-editor";
import { DeleteSlideButton } from "./delete-slide-button";
import { SLideHelpText } from "./slide-help-text";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { useCardEdit } from "@/hooks/use-card-edit";
import { cn } from "@/utils";
import { SLIDE_ANIMATIONS } from "@/constants";
import type { OutlineCard } from "@/types";

interface SlideOutlineProps {
  card: OutlineCard;
  isEditing: boolean;
  isSelected: boolean;
  isDragging?: boolean;
  editText: string;
  onEditChange: (value: string) => void;
  onEditBlur: () => void;
  onEditKeyDown: (e: React.KeyboardEvent) => void;
  onCardDoubleClick: () => void;
  onDeleteClick: () => void;
  dragHandlers?: { attributes?: any; listeners?: any };
  dragOverStyles?: React.CSSProperties;
  readOnly?: boolean;
}

const SlideOutlineCard = ({
  card,
  dragHandlers = {},
  dragOverStyles = {},
  editText,
  isEditing,
  isSelected,
  isDragging = false,
  onCardDoubleClick,
  onDeleteClick,
  onEditBlur,
  onEditChange,
  onEditKeyDown,
  readOnly = false,
}: SlideOutlineProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useDeleteConfirm(isHovered);
  useCardEdit(isEditing, inputRef);

  const handleDoubleClick = useCallback(() => {
    if (!isEditing && !readOnly) {
      onCardDoubleClick();
    }
  }, [isEditing, readOnly, onCardDoubleClick]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (showDeleteConfirm) {
        onDeleteClick();
        setShowDeleteConfirm(false);
      } else {
        setShowDeleteConfirm(true);
      }
    },
    [showDeleteConfirm, onDeleteClick, setShowDeleteConfirm]
  );

  const handleCancelDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteConfirm(false);
    },
    [setShowDeleteConfirm]
  );

  const handleEditConfirm = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEditBlur();
    },
    [onEditBlur]
  );

  const handleEditCancel = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEditChange(card.title);
      onEditBlur();
    },
    [card.title, onEditChange, onEditBlur]
  );

  return (
    <motion.div
      layout
      layoutId={`card-${card.id}`}
      {...SLIDE_ANIMATIONS.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full relative group"
      style={{ ...(isDragging && { zIndex: 50 }) }}
    >
      <div
        style={dragOverStyles}
        className={cn(
          "p-4 rounded-xl transition-all duration-200 relative overflow-hidden border",
          !isEditing && !readOnly && "hover:shadow-lg",
          isSelected &&
            "ring-2 ring-primary border-primary/50 shadow-lg bg-primary/5",
          isEditing &&
            "ring-2 ring-primary/70 shadow-xl bg-background border-primary/50",
          isDragging &&
            "shadow-2xl scale-105 -rotate-1 cursor-grabbing border-primary",
          !isDragging &&
            !isEditing &&
            !readOnly &&
            "hover:border-primary/50 hover:shadow-md",
          readOnly && "cursor-default opacity-75",
          !isSelected &&
            !isDragging &&
            !isEditing &&
            "border-border/60 bg-muted/30 hover:bg-muted/50"
        )}
      >
        {(isSelected || isHovered) && !isEditing && (
          <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent pointer-events-none" />
        )}
        {isSelected && (
          <motion.div className="absolute left-0 top-0 bottom-0 w-1 bg-primary origin-top" />
        )}
        {isEditing && (
          <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-primary/70 to-primary origin-left" />
        )}
        {isDragging && (
          <motion.div className="absolute bg-red inset-0 bg-primary/10 border-2 border-primary rounded-xl pointer-events-none" />
        )}

        <div
          className={cn(
            "flex items-center gap-3 transition-all duration-200 relative z-10",
            (isHovered || isDragging) && !readOnly && !isEditing && "pl-6"
          )}
        >
          {!readOnly && !isEditing && (
            <SlideDragHandle
              isVisible={isHovered || isDragging}
              dragHandlers={dragHandlers}
            />
          )}

          <SLideOrderBadge
            order={card.order}
            isEditing={isEditing}
            isSelected={isSelected}
          />

          <SlideOutlineEditor
            isEditing={isEditing}
            editText={editText}
            cardTitle={card.title}
            isSelected={isSelected}
            readOnly={readOnly}
            inputRef={inputRef}
            onEditChange={onEditChange}
            onEditBlur={onEditBlur}
            onEditKeyDown={onEditKeyDown}
            onEditConfirm={handleEditConfirm}
            onEditCancel={handleEditCancel}
            onDoubleClick={handleDoubleClick}
          />

          {!readOnly && (isHovered || showDeleteConfirm) && !isEditing && (
            <DeleteSlideButton
              onDelete={handleDelete}
              showDeleteConfirm={showDeleteConfirm}
              onCancelDelete={handleCancelDelete}
              onConfirmDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <SLideHelpText
        isVisible={isHovered && !isEditing && !readOnly && !showDeleteConfirm}
      />
    </motion.div>
  );
};

export default memo(SlideOutlineCard);

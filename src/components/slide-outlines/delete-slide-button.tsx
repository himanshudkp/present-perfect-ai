"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { SLIDE_ANIMATIONS } from "@/lib/constants";

interface DeleteSlideButtonProps {
  showDeleteConfirm: boolean;
  onDelete: (e: React.MouseEvent<Element, MouseEvent>) => void;
  onCancelDelete: (e: React.MouseEvent<Element, MouseEvent>) => void;
  onConfirmDelete: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

export const DeleteSlideButton = memo(
  ({
    onDelete,
    showDeleteConfirm,
    onCancelDelete,
    onConfirmDelete,
  }: DeleteSlideButtonProps) => (
    <motion.div
      initial={SLIDE_ANIMATIONS.deleteButton.initial}
      animate={SLIDE_ANIMATIONS.deleteButton.animate}
      exit={SLIDE_ANIMATIONS.deleteButton.exit}
      transition={SLIDE_ANIMATIONS.deleteButton.transition}
      className="shrink-0"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <AnimatePresence mode="wait">
        {showDeleteConfirm ? (
          <motion.div
            key="delete-confirm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex items-center gap-2 bg-destructive/10 rounded-lg p-2 border border-destructive/20"
          >
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <span className="text-xs font-medium text-destructive whitespace-nowrap">
              Delete?
            </span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="destructive"
                onClick={onConfirmDelete}
                className="h-7 px-3 text-xs"
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCancelDelete}
                className="h-7 px-3 text-xs"
              >
                No
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="delete-button" {...SLIDE_ANIMATIONS.editConfirm}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
);

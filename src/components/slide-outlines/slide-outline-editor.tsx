"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/utils";
import { SLIDE_ANIMATIONS } from "@/constants";

interface SlideOutlineEditorProps {
  isEditing: boolean;
  editText: string;
  cardTitle: string;
  isSelected: boolean;
  readOnly: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onEditChange: (value: string) => void;
  onEditBlur: () => void;
  onEditKeyDown: (e: React.KeyboardEvent<Element>) => void;
  onEditConfirm: (e: React.MouseEvent<Element, MouseEvent>) => void;
  onEditCancel: (e: React.MouseEvent<Element, MouseEvent>) => void;
  onDoubleClick: () => void;
}

export const SlideOutlineEditor = ({
  isEditing,
  editText,
  cardTitle,
  isSelected,
  readOnly,
  inputRef,
  onEditChange,
  onEditBlur,
  onEditKeyDown,
  onEditConfirm,
  onEditCancel,
  onDoubleClick,
}: SlideOutlineEditorProps) => (
  <div className="flex-1 min-w-0" onDoubleClick={onDoubleClick}>
    {isEditing ? (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => onEditChange(e.target.value.slice(0, 100))}
          onBlur={onEditBlur}
          onKeyDown={onEditKeyDown}
          maxLength={100}
          className="text-base sm:text-lg font-medium border-2 border-primary focus-visible:ring-primary shadow-sm"
          placeholder="Enter slide title..."
          disabled={readOnly}
        />
        <div className="flex gap-1 shrink-0">
          <motion.div {...SLIDE_ANIMATIONS.editConfirm}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onEditConfirm}
              className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Check className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div {...SLIDE_ANIMATIONS.editConfirm}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onEditCancel}
              className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
            "font-semibold truncate transition-all duration-200",
            isSelected
              ? "text-base sm:text-lg text-primary"
              : "text-sm sm:text-base"
          )}
          title={cardTitle}
        >
          {cardTitle}
        </p>
      </div>
    )}
  </div>
);

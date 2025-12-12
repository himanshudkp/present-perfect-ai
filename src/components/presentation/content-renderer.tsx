"use client";

import { ChangeEvent, memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Title,
} from "../slides-editor/headings-title";
import type { ContentItem } from "@/lib/types";

export interface ContentRendererProps {
  content: ContentItem;
  onContentChange: (
    contentId: string,
    newContent:
      | ContentItem
      | string
      | string[]
      | string[][]
      | ContentItem[]
      | (string | ContentItem)[]
  ) => void;
  isPreview?: boolean;
  isEditable?: boolean;
  slideId: string;
  index?: number;
}

const ANIMATION_PROPS = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
} as const;

const COMPONENT_MAP = {
  heading1: Heading1,
  heading2: Heading2,
  heading3: Heading3,
  heading4: Heading4,
  title: Title,
} as const;

interface CommonProps {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isPreview?: boolean;
  readOnly?: boolean;
}

export const ContentRenderer = memo(
  ({
    content,
    onContentChange,
    slideId,
    index,
    isEditable = true,
    isPreview = false,
  }: ContentRendererProps) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        onContentChange(content.id, e.target.value);
      },
      [content.id, onContentChange]
    );

    const commonProps: CommonProps = useMemo(
      () => ({
        placeholder: content.placeholder,
        value: (content.content as string) || "",
        onChange: handleChange,
        isPreview,
        readOnly: isPreview || !isEditable,
      }),
      [
        content.placeholder,
        content.content,
        handleChange,
        isPreview,
        isEditable,
      ]
    );

    const Component = COMPONENT_MAP[content.type as keyof typeof COMPONENT_MAP];

    if (!Component) {
      return (
        <div className="text-red-500 p-2">
          Unknown content type: {content.type}
        </div>
      );
    }

    return (
      <motion.div
        {...ANIMATION_PROPS}
        className="w-full h-full"
        {...(isPreview ? {} : ANIMATION_PROPS)}
      >
        <Component {...commonProps} />
      </motion.div>
    );
  }
);

"use client";

import { ContentItem } from "@/lib/types";
import React, { ChangeEvent, Fragment, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Heading1 } from "../project-editor/headings";

interface ContentRendererProps {
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

const ContentRenderer = ({
  content,
  onContentChange,
  slideId,
  index,
  isEditable,
  isPreview,
}: ContentRendererProps) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) =>
      onContentChange(content.id, e.target.value),
    [content.id, onContentChange]
  );
  const commonProps = {
    placeHolder: content.placeholder,
    value: content.content as string,
    onChange: handleChange,
    isPreview: isPreview,
  };
  switch (content.type) {
    case "heading1":
      return (
        <motion.div className="w-full h-full">
          <Heading1 {...commonProps} />
        </motion.div>
      );
    default:
      return <h1>Nothing</h1>;
  }
};

export const RecursiveComponent = ({
  content,
  onContentChange,
  slideId,
  index,
  isEditable = true,
  isPreview = false,
}: ContentRendererProps) => {
  if (isPreview) {
    return (
      <ContentRenderer
        content={content}
        onContentChange={onContentChange}
        slideId={slideId}
        index={index}
        isEditable={isEditable}
        isPreview={isPreview}
      />
    );
  }
  return (
    <Fragment>
      <ContentRenderer
        content={content}
        onContentChange={onContentChange}
        slideId={slideId}
        index={index}
        isEditable={isEditable}
        isPreview={isPreview}
      />
    </Fragment>
  );
};

export default memo(RecursiveComponent);

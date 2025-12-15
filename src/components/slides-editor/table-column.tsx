"use clint";

import { Fragment, memo } from "react";
import { motion } from "framer-motion";
import { DropZone } from "./drop-zone";
import { RecursiveComponent } from "../presentation/recursive-component";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/lib/types";
import { ANIMATION_PROPS } from "@/lib/constants";

interface TableColumnProps {
  content: ContentItem;
  isEditable: boolean;
  slideId: string;
  handleContentChange: (
    contentId: string,
    newContent:
      | string
      | ContentItem
      | string[]
      | string[][]
      | ContentItem[]
      | (string | ContentItem)[]
  ) => void;
  isPreview?: boolean;
  className?: string;
}

const TableColumn = memo(
  ({
    content,
    isPreview,
    isEditable,
    slideId,
    handleContentChange,
  }: TableColumnProps) => {
    if (Array.isArray(content.content)) {
      return (
        <motion.div
          {...ANIMATION_PROPS}
          className={cn("w-full h-full flex flex-col", content.className)}
        >
          {content.content.length > 0 ? (
            (content.content as ContentItem[]).map(
              (subItem: ContentItem, subIndex: number) => {
                return (
                  <Fragment key={subItem.id || ~`item-${subIndex}`}>
                    {!isPreview &&
                      isEditable &&
                      subIndex === 0 &&
                      !subItem.restrictToDrop && (
                        <DropZone
                          index={0}
                          parentId={content.id}
                          slideId={slideId}
                        />
                      )}
                    <RecursiveComponent
                      content={subItem}
                      onContentChange={handleContentChange}
                      slideId={slideId}
                      index={subIndex}
                      isEditable={isEditable}
                      isPreview={isPreview}
                    />
                    {!isPreview && isEditable && !subItem.restrictToDrop && (
                      <DropZone
                        index={subIndex + 1}
                        parentId={content.id}
                        slideId={slideId}
                      />
                    )}
                  </Fragment>
                );
              }
            )
          ) : isEditable ? (
            <DropZone index={0} parentId={content.id} slideId={slideId} />
          ) : null}
        </motion.div>
      );
    }
  }
);

export default TableColumn;

"use client";

import { Fragment, memo } from "react";
import { ContentRenderer, ContentRendererProps } from "./content-renderer";
import type { ContentItem } from "@/lib/types";

interface RecursiveComponentProps extends ContentRendererProps {
  depth?: number;
  maxDepth?: number;
}

export const RecursiveComponent = memo(
  ({
    content,
    onContentChange,
    slideId,
    index,
    isEditable = true,
    isPreview = false,
    depth = 0,
    maxDepth = 10,
  }: RecursiveComponentProps) => {
    if (depth > maxDepth) {
      return null;
    }

    if (Array.isArray(content.content)) {
      return (
        <div className="w-full h-full">
          {content.content.map((item, idx) => {
            if (typeof item === "string") {
              return (
                <Fragment key={idx}>
                  <span>{item}</span>
                </Fragment>
              );
            }

            return (
              <RecursiveComponent
                key={idx}
                content={item as ContentItem}
                onContentChange={onContentChange}
                slideId={slideId}
                index={idx}
                isEditable={isEditable}
                isPreview={isPreview}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            );
          })}
        </div>
      );
    }

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
);

"use client";

import { Fragment, memo, useMemo } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { RecursiveComponent } from "../presentation/recursive-component";
import type { ContentItem } from "@/types";

interface ResizableColumnProps {
  content: ContentItem[];
  className?: string;
  isEditable: boolean;
  slideId: string;
  handleContentChange: (contentId: string, newContent: any) => void;
  isPreview?: boolean;
}

const MIN_COLUMNS = 2;

const createEmptyColumn = (): ContentItem => {
  return {
    id: crypto.randomUUID(),
    type: "paragraph",
    name: "Paragraph",
    content: "",
    placeholder: "Start typing...",
  };
};

const ResizableColumn = ({
  content,
  handleContentChange,
  isEditable = true,
  slideId,
  className,
  isPreview = false,
}: ResizableColumnProps) => {
  const columns = useMemo<ContentItem[]>(() => {
    if (content.length >= MIN_COLUMNS) return content;

    return Array.from(
      { length: Math.max(MIN_COLUMNS, content.length) },
      (_, i) => content[i] ?? createEmptyColumn()
    );
  }, [content]);

  return (
    <div className="relative w-full h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className={`h-full w-full flex ${className ?? ""}`}
      >
        {columns.map((item, index) => (
          <Fragment key={item.id}>
            <ResizablePanel minSize={20} defaultSize={100 / columns.length}>
              <div className="h-full w-full">
                <RecursiveComponent
                  content={item}
                  isPreview={isPreview}
                  isEditable={isEditable}
                  onContentChange={handleContentChange}
                  slideId={slideId}
                />
              </div>
            </ResizablePanel>

            {index < columns.length - 1 && isEditable && (
              <ResizableHandle withHandle={!isPreview} />
            )}
          </Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );
};

export default memo(ResizableColumn);

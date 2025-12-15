"use client";

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Title,
} from "../slides-editor/headings-title";
import { Paragraph } from "../slides-editor/paragraph";
import SlideTable from "../slides-editor/slide-table";
import ResizableColumn from "../slides-editor/resizable-column";
import TableColumn from "../slides-editor/table-column";
import { CustomImage } from "../slides-editor/custom-image";
import { BlockQuote } from "../slides-editor/block-quote";
import { CalloutBox } from "../slides-editor/callout-box";
import { CodeBlock } from "../slides-editor/code-block";
import TableContents from "../slides-editor/table-contents";
import NumberedList from "../slides-editor/numbered-list";
import { BulletList } from "../slides-editor/bullet-list";
import { TodoList } from "../slides-editor/todo-list";
import { SlideDivider } from "../slides-editor/slide-divider";
import type { ChangeEvent } from "react";
import type { ContentItem } from "@/lib/types";
import { ANIMATION_PROPS } from "@/lib/constants";

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

const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div className="w-full h-full" {...ANIMATION_PROPS}>
    {children}
  </motion.div>
);

export const ContentRenderer = memo(
  ({
    content,
    onContentChange,
    slideId,
    isEditable = true,
    isPreview = false,
  }: ContentRendererProps) => {
    const handleTextChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        onContentChange(content.id, e.target.value);
      },
      [content.id, onContentChange]
    );

    const textProps = {
      placeholder: content.placeholder,
      value: (content.content as string) || "",
      onChange: handleTextChange,
      isPreview,
      readOnly: isPreview || !isEditable,
    };

    switch (content.type) {
      case "heading1":
        return (
          <MotionWrapper>
            <Heading1 {...textProps} />
          </MotionWrapper>
        );
      case "heading2":
        return (
          <MotionWrapper>
            <Heading2 {...textProps} />
          </MotionWrapper>
        );
      case "heading3":
        return (
          <MotionWrapper>
            <Heading3 {...textProps} />
          </MotionWrapper>
        );
      case "heading4":
        return (
          <MotionWrapper>
            <Heading4 {...textProps} />
          </MotionWrapper>
        );
      case "title":
        return (
          <MotionWrapper>
            <Title {...textProps} />
          </MotionWrapper>
        );
      case "paragraph":
        return (
          <MotionWrapper>
            <Paragraph {...textProps} />
          </MotionWrapper>
        );
      case "blockquote":
        return (
          <MotionWrapper>
            <BlockQuote>
              <Paragraph {...textProps} />
            </BlockQuote>
          </MotionWrapper>
        );
      case "calloutBox":
        return (
          <MotionWrapper>
            <CalloutBox
              type={content.callOutType || "info"}
              className={content.className}
            >
              <Paragraph {...textProps} />
            </CalloutBox>
          </MotionWrapper>
        );
      case "table":
        return (
          <MotionWrapper>
            <SlideTable
              content={content.content as string[][]}
              onChange={(v) => onContentChange(content.id, v)}
              initialColumnSize={content.initialColumns}
              initialRowSize={content.initialRows}
              isEditable={isEditable}
              isPreview={isPreview}
            />
          </MotionWrapper>
        );
      case "column":
        return (
          <MotionWrapper>
            <TableColumn
              content={content}
              handleContentChange={onContentChange}
              isEditable={isEditable}
              slideId={slideId}
              isPreview={isPreview}
            />
          </MotionWrapper>
        );
      case "resizable-column":
        return Array.isArray(content.content) ? (
          <MotionWrapper>
            <ResizableColumn
              content={content.content as ContentItem[]}
              handleContentChange={onContentChange}
              isEditable={isEditable}
              isPreview={isPreview}
              slideId={slideId}
              className={content.className}
            />
          </MotionWrapper>
        ) : null;
      case "image":
        return (
          <MotionWrapper>
            <CustomImage
              src={content.content as string}
              alt={content.alt || "Image"}
              contentId={content.id}
              onContentChange={onContentChange}
              className={content.className}
              isEditable={isEditable}
              isPreview={isPreview}
            />
          </MotionWrapper>
        );
      case "numberedList":
        return (
          <MotionWrapper>
            <NumberedList
              items={content.content as string[]}
              onChange={(v) => onContentChange(content.id, v)}
              className={content.className}
            />
          </MotionWrapper>
        );
      case "bulletList":
        return (
          <MotionWrapper>
            <BulletList
              items={content.content as string[]}
              onChange={(v) => onContentChange(content.id, v)}
              className={content.className}
            />
          </MotionWrapper>
        );
      case "todoList":
        return (
          <MotionWrapper>
            <TodoList
              items={content.content as string[]}
              onChange={(v) => onContentChange(content.id, v)}
              className={content.className}
            />
          </MotionWrapper>
        );
      case "codeBlock":
        return (
          <MotionWrapper>
            <CodeBlock
              code={content.code}
              language={content.language}
              className={content.className}
              onChange={() => {}}
            />
          </MotionWrapper>
        );
      case "tableOfContents":
        return (
          <MotionWrapper>
            <TableContents
              items={content.content as string[]}
              className={content.className}
              onItemClick={() => {}}
            />
          </MotionWrapper>
        );
      case "divider":
        return (
          <MotionWrapper>
            <SlideDivider className={content.className!} />
          </MotionWrapper>
        );
      default:
        return null;
    }
  }
);

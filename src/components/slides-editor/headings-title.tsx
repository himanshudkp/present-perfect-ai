"use client";

import React, { type CSSProperties, useEffect, useRef } from "react";
import { cn } from "@/utils";

interface HeadingProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  styles?: CSSProperties;
  isPreview?: boolean;
}

const createHeading = (
  displayName: string,
  defaultClassName: string,
  defaultSize: number = 16
) => {
  const Heading = React.forwardRef<HTMLTextAreaElement, HeadingProps>(
    ({ children, styles, isPreview = false, className, ...props }, ref) => {
      const textAreaRef = useRef<HTMLTextAreaElement>(null);

      useEffect(() => {
        const textarea = textAreaRef.current;
        if (textarea && !isPreview) {
          const adjustHeight = () => {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.max(
              textarea.scrollHeight,
              defaultSize
            )}px`;
          };

          const resizeObserver = new ResizeObserver(adjustHeight);
          resizeObserver.observe(textarea);
          adjustHeight();

          return () => {
            resizeObserver.disconnect();
          };
        }
      }, [isPreview]);

      return (
        <textarea
          className={cn(
            "w-full bg-transparent font-bold text-gray-900 dark:text-gray-100",
            "placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "focus:outline-none overflow-hidden resize-none",
            defaultClassName,
            isPreview && "text-xs cursor-default",
            className
          )}
          style={{
            padding: 0,
            margin: 0,
            color: "inherit",
            boxSizing: "content-box",
            lineHeight: "1.2em",
            minHeight: `${defaultSize}px`,
            ...styles,
          }}
          ref={(element) => {
            textAreaRef.current = element;
            if (typeof ref === "function") ref(element);
            else if (ref) ref.current = element;
          }}
          readOnly={isPreview}
          disabled={isPreview}
          {...props}
        />
      );
    }
  );

  Heading.displayName = displayName;
  return Heading;
};

const Heading1 = createHeading("Heading1", "text-5xl", 60);
const Heading2 = createHeading("Heading2", "text-4xl", 48);
const Heading3 = createHeading("Heading3", "text-3xl", 36);
const Heading4 = createHeading("Heading4", "text-2xl", 28);
const Title = createHeading("Title", "text-6xl", 72);

export { Heading1, Heading2, Heading3, Heading4, Title };

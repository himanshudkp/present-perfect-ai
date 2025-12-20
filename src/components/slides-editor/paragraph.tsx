"use client";

import React, { memo, useEffect, useRef } from "react";
import { cn } from "@/utils";

interface ParagraphProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  styles?: React.CSSProperties;
  isPreview?: boolean;
}

export const Paragraph = memo(
  React.forwardRef<HTMLTextAreaElement, ParagraphProps>(
    ({ className, styles, isPreview = false, ...props }, ref) => {
      const textareaRef = useRef<HTMLTextAreaElement>(null);

      useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea || isPreview) return;

        const adjustHeight = () => {
          textarea.style.height = "auto";
          textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
        };

        const resizeObserver = new ResizeObserver(adjustHeight);
        resizeObserver.observe(textarea);
        adjustHeight();

        return () => resizeObserver.disconnect();
      }, [isPreview]);

      const setRefs = (element: HTMLTextAreaElement | null) => {
        textareaRef.current = element;
        if (typeof ref === "function") ref(element);
        else if (ref) ref.current = element;
      };

      return (
        <textarea
          className={cn(
            "w-full bg-transparent font-normal placeholder:text-gray-400 focus:outline-none resize-none overflow-hidden",
            isPreview ? "text-xs" : "text-sm",
            className
          )}
          style={{
            padding: 0,
            margin: 0,
            color: "inherit",
            boxSizing: "content-box",
            lineHeight: "1.5rem",
            minHeight: "1.5rem",
            ...styles,
          }}
          ref={setRefs}
          readOnly={isPreview}
          disabled={isPreview}
          {...props}
        />
      );
    }
  )
);

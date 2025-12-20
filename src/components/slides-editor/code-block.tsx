"use client";

import { memo, useMemo } from "react";
import { useSlideStore } from "@/store/use-slide-store";
import { cn } from "@/utils";

interface CodeBlockProps {
  code?: string;
  language?: string;
  onChange: (newCode: string) => void;
  className?: string;
  isEditable?: boolean;
}

export const CodeBlock = memo(
  ({
    onChange,
    className,
    code = "",
    language,
    isEditable = true,
  }: CodeBlockProps) => {
    const { currentTheme } = useSlideStore();

    const preStyles = useMemo(
      () => ({ backgroundColor: `${currentTheme.accentColor}20` }),
      [currentTheme.accentColor]
    );

    return (
      <pre
        className={`p-4 rounded-lg overflow-x-auto border border-gray-200 ${className}`}
        style={preStyles}
      >
        <code className={`language-${language || "plaintext"}`}>
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            readOnly={!isEditable}
            style={{ color: currentTheme.fontColor }}
            className={cn(
              "w-full bg-transparent outline-none font-mono text-sm",
              !isEditable && "cursor-not-allowed"
            )}
            spellCheck={false}
          />
        </code>
      </pre>
    );
  }
);

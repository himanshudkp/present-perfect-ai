"use client";

import { memo, useMemo } from "react";
import { useSlideStore } from "@/store/use-slide-store";

interface BlockQuoteProps extends React.QuoteHTMLAttributes<HTMLQuoteElement> {
  children: React.ReactNode;
  className?: string;
}

export const BlockQuote = memo(
  ({ children, className, ...props }: BlockQuoteProps) => {
    const { currentTheme } = useSlideStore();

    const blockquoteStyles = useMemo(
      () => ({ borderLeftColor: currentTheme.accentColor }),
      [currentTheme.accentColor]
    );

    return (
      <blockquote
        className={`pl-4 border-l-4 italic my-4 py-2 leading-relaxed transition-colors ${className}`}
        style={blockquoteStyles}
        {...props}
      >
        {children}
      </blockquote>
    );
  }
);

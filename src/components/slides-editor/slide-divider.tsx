"use client";

import { memo, useMemo } from "react";
import { useSlideStore } from "@/store/use-slide-store";

interface SlideDividerProps {
  className?: string;
}

export const SlideDivider = memo(({ className }: SlideDividerProps) => {
  const { currentTheme } = useSlideStore();

  const style = useMemo(
    () => ({ backgroundColor: currentTheme.accentColor }),
    [currentTheme.accentColor]
  );

  return <hr className={`my-4 ${className}`} style={style} />;
});

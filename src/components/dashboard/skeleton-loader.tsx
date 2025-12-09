"use client";

import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { GRID_CLASSES } from "@/lib/constants";
import type { ViewMode } from "@/lib/types";

const SKELETON_COUNT = {
  list: 4,
  grid: 8,
  compact: 12,
} as const;

const SkeletonGrid = memo(({ viewMode }: { viewMode: ViewMode }) => {
  const count = SKELETON_COUNT[viewMode] || 8;

  const items = useMemo(() => [...Array(count)], [count]);

  return (
    <div className={cn(GRID_CLASSES[viewMode])}>
      {items.map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-muted animate-pulse rounded-lg",
            viewMode === "list" ? "h-20" : "aspect-video"
          )}
        />
      ))}
    </div>
  );
});

export default SkeletonGrid;

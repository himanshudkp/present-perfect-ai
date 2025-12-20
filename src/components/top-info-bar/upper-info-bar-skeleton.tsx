"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils";

const UpperInfoBarSkeleton = () => {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex shrink-0 flex-wrap items-center gap-2",
        "border-b border-border bg-background/95 backdrop-blur-md p-3 sm:p-4",
        "justify-between transition-all duration-200 shadow-sm"
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Separator className="h-6" orientation="vertical" />
      </div>

      <div className="flex-1 max-w-xl mx-2 sm:mx-4">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 rounded-full border border-border/50 bg-muted/30 flex items-center gap-3 px-4"
        >
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </motion.div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 ml-auto flex-wrap justify-end">
        <Skeleton className="h-9 w-9 rounded-md" />

        <Skeleton className="h-9 w-9 rounded-md" />

        <div className="relative flex items-center h-10 rounded-full bg-muted border border-border p-1 gap-0.5">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <Skeleton className="h-9 w-20 sm:w-24 rounded-lg" />

        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Skeleton className="h-9 w-28 sm:w-36 rounded-lg" />
        </motion.div>

        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </header>
  );
};

export default memo(UpperInfoBarSkeleton);

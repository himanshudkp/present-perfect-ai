"use client";

import React, { memo, useMemo } from "react";
import { Skeleton } from "../../ui/skeleton";

const ListSkeleton = memo(function ListSkeleton({
  count,
  prefix,
}: {
  count: number;
  prefix: string;
}) {
  const items = useMemo(() => Array.from({ length: count }), [count]);

  return (
    <div className="space-y-2">
      {items.map((_, i) => (
        <div
          key={`${prefix}-${i}`}
          className="flex items-center gap-3 rounded-md p-2"
        >
          <Skeleton className="h-5 w-5 shrink-0 rounded" />
          <Skeleton className="h-4 flex-1 rounded" />
        </div>
      ))}
    </div>
  );
});

function SidebarSkeleton() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center gap-3 border-b px-4">
        <Skeleton className="h-8 w-8 shrink-0 rounded" />
        <Skeleton className="h-8 flex-1 rounded" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 border-b px-4 py-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="p-4">
          <div className="mb-6">
            <Skeleton className="mb-3 h-4 w-24 rounded" />
            <ListSkeleton count={4} prefix="nav" />
          </div>

          <div className="mb-6">
            <Skeleton className="mb-3 h-4 w-28 rounded" />
            <ListSkeleton count={3} prefix="recent" />
          </div>
        </div>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
          <Skeleton className="h-5 w-5 shrink-0 rounded" />
        </div>
      </div>
    </div>
  );
}

export default memo(SidebarSkeleton);

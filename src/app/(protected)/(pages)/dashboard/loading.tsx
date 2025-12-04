import { Skeleton } from "@/components/ui/skeleton";

const ITEMS = Array.from({ length: 8 });

export default function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-28 rounded" />
        <Skeleton className="h-8 w-24 rounded" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Skeleton className="h-10 w-full sm:w-64 rounded" />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-10 rounded" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-24 rounded" />
      </div>

      <Skeleton className="h-4 w-40 rounded" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ITEMS.map((_, i) => (
          <Skeleton
            key={i}
            className="h-48 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

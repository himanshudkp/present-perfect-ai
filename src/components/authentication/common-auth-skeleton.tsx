import { Skeleton } from "@/components/ui/skeleton";

export const CommonAuthSkeleton = () => {
  return (
    <div className="w-full max-w-sm mx-auto rounded-lg border border-border/50 bg-background/40 backdrop-blur-sm p-4 space-y-4">
      <div className="flex flex-col items-center space-y-1">
        <Skeleton className="h-7 w-28 rounded-md" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-3 w-5" />
        <Skeleton className="h-px w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
      <div className="space-y-1 pt-2">
        <Skeleton className="h-3 w-32 mx-auto" />
        <Skeleton className="h-2.5 w-24 mx-auto" />
      </div>
    </div>
  );
};

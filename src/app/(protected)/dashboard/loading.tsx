import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils";

const ITEMS = [1, 2, 3, 4, 5, 6] as const;

export default function Loading() {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ITEMS.map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "aspect-video rounded-lg bg-muted animate-pulse",
              ` delay-[${1 * 100}]`
            )}
          />
        ))}
      </div>
    </div>
  );
}

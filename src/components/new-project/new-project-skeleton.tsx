import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const NewProjectSkeleton = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <Skeleton className="h-10 w-3/4 max-w-md mx-auto" />
        <Skeleton className="h-4 w-1/2 max-w-sm mx-auto" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card
            key={i}
            className="overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardHeader className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-10 w-full rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 flex-1 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Card
              key={i}
              className="p-4 hover:bg-accent/50 transition-colors"
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Skeleton className="h-16 w-24 rounded-md shrink-0" />

                  <div className="space-y-2 flex-1 min-w-0">
                    <Skeleton className="h-5 w-48 max-w-full" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card
              key={i}
              className="overflow-hidden"
              style={{ animationDelay: `${(i + 6) * 100}ms` }}
            >
              <Skeleton className="h-32 w-full" />
              <CardContent className="pt-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewProjectSkeleton;

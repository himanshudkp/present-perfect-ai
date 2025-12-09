import { FileText } from "lucide-react";

export const EmptySlideState = () => {
  return (
    <div className="flex flex-col items-center gap-5 py-16 border-2 border-dashed rounded-lg bg-muted/20">
      <FileText className="h-12 w-12 " />
      <h3 className="text-base font-semibold mb-1">No slides yet</h3>
      <p className="text-sm text-muted-foreground">
        Add slides above to get started
      </p>
    </div>
  );
};

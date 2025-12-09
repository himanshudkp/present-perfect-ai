import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getTimeAgo } from "@/lib/utils";
import { FileText, Star } from "lucide-react";

interface ExpandedProjectItemProps {
  noOfSlides: number;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: Date;
  title: string;
  onProjectClick: () => void;
}

export default function ExpandedProjectItem({
  noOfSlides,
  isActive,
  isFavorite,
  createdAt,
  title,
  onProjectClick,
}: ExpandedProjectItemProps) {
  const createdDate = new Date(createdAt);
  const timeAgo = getTimeAgo(createdDate);
  const createdDateLabel = createdDate.toLocaleDateString();
  const slideCount = Math.max(0, noOfSlides);

  return (
    <SidebarMenuButton
      asChild
      tooltip={title}
      isActive={isActive}
      className={cn(
        "group relative px-2 transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-r-full"
          : "hover:bg-accent/50 hover:translate-x-1"
      )}
    >
      <Button
        variant="ghost"
        onClick={onProjectClick}
        className="h-auto w-full justify-start gap-2 px-2 py-2 text-xs font-normal"
        title={title}
        aria-label={`Open project: ${title}`}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all duration-200",
            isActive
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          <FileText className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "truncate text-xs font-medium",
                isActive && "font-semibold"
              )}
            >
              {title}
            </span>

            {isFavorite && (
              <Star className="h-3 w-3 shrink-0 fill-yellow-500 text-yellow-500" />
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{slideCount} slides</span>
            <span>•</span>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate">{timeAgo}</span>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Created: {createdDateLabel}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Button>
    </SidebarMenuButton>
  );
}

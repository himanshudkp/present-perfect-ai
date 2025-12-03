import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Star } from "lucide-react";
import { cn } from "@/utils/utils";

interface CollapsedProjectItemProps {
  noOfSlides: number;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: Date;
  title: string;
  onProjectClick: () => void;
}

export default function CollapsedProjectItem({
  noOfSlides,
  isActive,
  isFavorite,
  createdAt,
  title,
  onProjectClick,
}: CollapsedProjectItemProps) {
  const createdDate = new Date(createdAt);
  const createdDateLabel = createdDate.toLocaleDateString();
  const slideCount = Math.max(0, noOfSlides);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={cn(
            "relative transition-all duration-200",
            isActive
              ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-r-full"
              : "hover:bg-accent/50"
          )}
        >
          <Button
            variant="ghost"
            onClick={onProjectClick}
            className="h-10 w-full justify-center p-0"
            aria-label={`Open project ${title}`}
          >
            <div className="relative">
              <FileText
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />

              {isFavorite && (
                <Star className="absolute -top-1 -right-1 h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
              )}
            </div>
          </Button>
        </SidebarMenuButton>
      </TooltipTrigger>

      <TooltipContent side="right" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{title}</p>
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>{slideCount} slides</p>
            <p>{createdDateLabel}</p>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

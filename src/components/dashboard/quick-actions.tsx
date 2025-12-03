"use client";

import { memo } from "react";
import { Copy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/utils";

interface QuickActionsProps {
  isFavorite?: boolean | null;
  onFavorite: () => void;
  onCopyLink: () => void;
}

const QuickActions = ({
  isFavorite,
  onFavorite,
  onCopyLink,
}: QuickActionsProps) => {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-1 bg-background/95 backdrop-blur-md border rounded-lg shadow-lg p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFavorite}
              aria-label={isFavorite ? "Unfavorite" : "Favorite"}
              className="h-7 w-7 p-0 hover:bg-accent"
            >
              <Star
                className={cn(
                  "h-3.5 w-3.5",
                  isFavorite && "fill-current text-yellow-500"
                )}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFavorite ? "Unfavorite" : "Favorite"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyLink}
              aria-label="Copy Link"
              className="h-7 w-7 p-0 hover:bg-accent"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy Link</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default memo(QuickActions);

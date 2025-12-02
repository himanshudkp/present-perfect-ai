"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/utils";
import { Star } from "lucide-react";
import { memo } from "react";

interface IconButtonProps {
  icon: typeof Star;
  label: string;
  isFilled?: boolean;
  onClick: () => void;
}

const IconButton = ({
  icon: Icon,
  label,
  isFilled = false,
  onClick,
}: IconButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          className="h-7 w-7 p-0 hover:bg-accent"
        >
          <Icon
            className={cn(
              "h-3.5 w-3.5 transition-all",
              isFilled && "fill-current text-yellow-500"
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default memo(IconButton);

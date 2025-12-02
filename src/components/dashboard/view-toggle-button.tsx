"use client";

import { ViewMode } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { memo } from "react";

interface ViewToggleButtonProps {
  mode: ViewMode;
  currentMode: ViewMode;
  icon: any;
  label: string;
  onClick: (mode: ViewMode) => void;
}

const ViewToggleButton = ({
  mode,
  currentMode,
  icon: Icon,
  label,
  onClick,
}: ViewToggleButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={currentMode === mode ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onClick(mode)}
          className="h-8 w-8 p-0"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default memo(ViewToggleButton);

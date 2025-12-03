"use client";

import { memo } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ToggleSidebar = () => {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="transition-all duration-200 hover:bg-muted hover:scale-105 active:scale-95" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Toggle sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Separator className="h-6" orientation="vertical" />
    </div>
  );
};

export default memo(ToggleSidebar);

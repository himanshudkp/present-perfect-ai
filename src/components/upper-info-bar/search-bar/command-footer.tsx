"use client";

import { Zap } from "lucide-react";
import { memo } from "react";

export const CommandFooter = memo(() => (
  <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/50">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">
          ↑
        </kbd>
        <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">
          ↓
        </kbd>
        <span className="ml-1">Navigate</span>
      </div>
      <div className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">
          ↵
        </kbd>
        <span className="ml-1">Select</span>
      </div>
      <div className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">
          Esc
        </kbd>
        <span className="ml-1">Close</span>
      </div>
    </div>
    <div className="flex items-center gap-1">
      <Zap className="w-3 h-3" />
      <span>Quick Actions</span>
    </div>
  </div>
));

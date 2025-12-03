"use client";

import { memo } from "react";
import { FolderOpen } from "lucide-react";

function NoRecentProjects() {
  return (
    <div className="mx-3 p-4 rounded-lg border-2 border-dashed border-border/50 text-center space-y-2 group-data-[state=collapsed]:hidden">
      <FolderOpen className="h-8 w-8 mx-auto text-muted-foreground/50" />
      <p className="text-xs text-muted-foreground">No recent projects</p>
      <p className="text-[10px] text-muted-foreground/60">
        Create your first project to get started
      </p>
    </div>
  );
}

export default memo(NoRecentProjects);

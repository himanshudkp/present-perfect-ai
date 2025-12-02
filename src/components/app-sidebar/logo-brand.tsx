import React from "react";
import { SidebarMenuButton } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function LogoBrand() {
  return (
    <SidebarMenuButton
      size="lg"
      className="group hover:bg-accent/50 transition-all duration-200"
    >
      <div className="size-9 rounded-lg overflow-hidden bg-linear-to-br from-primary to-primary/70 flex items-center justify-center">
        <Avatar className="h-full w-full rounded-lg">
          <AvatarImage
            src="/logo.png"
            alt="PresentPerfect Logo"
            loading="lazy"
          />
          <AvatarFallback className="rounded-lg bg-transparent text-primary-foreground font-bold">
            PP
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-start group-data-[state=collapsed]:hidden">
        <span className="truncate text-primary text-xl font-bold">
          PresentPerfect
        </span>
        <span className="text-[11px] text-muted-foreground font-semibold">
          AI-Powered Presentations
        </span>
      </div>
    </SidebarMenuButton>
  );
}

"use client";

import { memo } from "react";
import { UserButton } from "@clerk/nextjs";
import { SidebarMenuButton } from "@/components/ui/sidebar";

const AVATAR_APPEARANCE = {
  elements: { avatarBox: "h-9 w-9" },
} as const;

interface UserProfileProps {
  userName: string;
  userEmail: string;
}

const UserProfile = ({ userEmail, userName }: UserProfileProps) => {
  return (
    <SidebarMenuButton
      size="lg"
      className="w-full transition-all duration-200 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-accent"
      tooltip={`${userName} • ${userEmail}`}
    >
      <UserButton appearance={AVATAR_APPEARANCE} />
      <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
        <span className="truncate font-semibold">{userName}</span>
        <span className="truncate text-xs text-muted-foreground">
          {userEmail}
        </span>
      </div>
    </SidebarMenuButton>
  );
};

export default memo(UserProfile);

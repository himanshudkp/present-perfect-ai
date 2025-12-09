"use client";

import { useEffect, useState } from "react";
import { Project, User } from "@/generated/prisma/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import AppSidebarFooter from "./app-sidebar-footer";
import LogoBrand from "./logo-brand";
import NavigationContainer from "./navigation-container";
import QuickAction from "./quick-action";
import RecentProjects from "./recent-projects";
import SidebarSkeleton from "./sidebar-skeleton";
import { DATA } from "@/lib/constants";

type AppSidebarProps = {
  recentProjects: Project[];
  user: User;
} & React.ComponentProps<typeof Sidebar>;

export default function AppSidebar({
  recentProjects,
  user,
  ...props
}: AppSidebarProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 25);

    return () => clearTimeout(timer);
  }, [recentProjects, user]);

  if (isLoading) return <SidebarSkeleton />;

  return (
    <Sidebar
      collapsible="icon"
      className="max-w-[280px] border-r transition-all duration-300 bg-linear-to-b from-background to-background/95 overflow-x-hidden"
      {...props}
    >
      <SidebarHeader className="pt-6 px-3 pb-4">
        <LogoBrand />
      </SidebarHeader>

      <SidebarContent className="px-2 gap-y-2 overflow-x-hidden">
        <SidebarGroup className="p-0">
          <QuickAction />
        </SidebarGroup>

        <SidebarSeparator className="group-data-[state=collapsed]:hidden" />

        <NavigationContainer items={DATA.navigation} />

        <SidebarSeparator className="group-data-[state=collapsed]:hidden" />

        <RecentProjects recentProjects={recentProjects} />
      </SidebarContent>

      <SidebarFooter className="border-t">
        <AppSidebarFooter dbUser={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

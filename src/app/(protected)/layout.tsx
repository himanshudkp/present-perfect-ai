import { getRecentProjects } from "@/actions/project";
import { authenticateUser } from "@/actions/user";
import AppSidebar from "@/components/app-sidebar";
import UpperInfoBar from "@/components/upper-info-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SidebarSkeleton from "@/components/app-sidebar/skeleton-loader";
import RouteTransition from "@/components/route-transition";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const auth = await authenticateUser();

  if (!auth.user) {
    redirect("/sign-in");
  }

  const recentProjects = await getRecentProjects();

  return (
    <SidebarProvider>
      <AppSidebar recentProjects={recentProjects.data || []} user={auth.user} />
      <SidebarInset>
        <UpperInfoBar user={auth.user} />
        <div className="p-4">
          <RouteTransition />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;

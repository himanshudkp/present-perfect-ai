import { redirect } from "next/navigation";
import AppSidebar from "@/components/app-sidebar/app-sidebar";
import UpperInfoBar from "@/components/top-info-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import RouteTransition from "@/components/route-transition/route-transition";
import { getRecentProjects } from "@/actions/projects";
import { authenticateUser } from "@/actions/user";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
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

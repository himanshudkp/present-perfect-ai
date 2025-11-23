import { getAllProjects } from "@/actions/project";
import { authenticateUser } from "@/actions/user";
import AnalyticsDashboard from "@/components/global/analytics-dashboard";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  const auth = await authenticateUser();
  if (!auth.user) {
    redirect("/sign-in");
  }

  const projectsData = await getAllProjects();
  const projects = projectsData?.data || [];

  return (
    <div className="w-full min-h-screen bg-background">
      <AnalyticsDashboard projects={projects} user={auth.user} />
    </div>
  );
}

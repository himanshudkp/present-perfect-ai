import { getAllProjects } from "@/actions/projects";
import Projects from "@/components/dashboard/projects";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import ProjectNotFound from "@/components/dashboard/project-not-found";
import DashboardErrorPage from "@/components/dashboard/dashboard-error-page";
import { type TabView } from "@/types";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: { filter?: string };
}) => {
  const filter = (await searchParams.filter) as TabView;

  try {
    const [allProjects] = await Promise.all([
      getAllProjects(),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);

    const projects = allProjects?.data || [];
    const hasProjects = projects.length > 0;
    const projectCount = projects.length;

    return (
      <div className="w-full flex flex-col gap-8 relative">
        <DashboardHeader
          projectCount={projectCount}
          hasProjects={hasProjects}
        />
        <div className="w-full">
          {hasProjects ? (
            <Projects
              projects={projects}
              filter={filter}
              defaultTab="all"
              defaultView="grid"
            />
          ) : (
            <ProjectNotFound />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load projects:", error);
    return <DashboardErrorPage />;
  }
};

export default DashboardPage;

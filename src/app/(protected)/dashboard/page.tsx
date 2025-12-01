import { getAllProjects } from "@/actions/project";
import Projects from "@/components/global/projects";
import DashboardHeader from "@/components/global/dashboard-header";
import ProjectNotFound from "@/components/global/project-not-found";
import DashboardErrorPage from "@/components/global/dashboard-error-page";

const DashboardPage = async () => {
  try {
    const [allProjects] = await Promise.all([
      getAllProjects(),
      new Promise((resolve) => setTimeout(resolve, 50)),
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
          {hasProjects ? <Projects projects={projects} /> : <ProjectNotFound />}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load projects:", error);
    return <DashboardErrorPage />;
  }
};

export default DashboardPage;

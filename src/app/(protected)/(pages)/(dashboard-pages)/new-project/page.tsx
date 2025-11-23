import React, { Suspense } from "react";
import NewProjectSkeleton from "@/components/global/new-project-skeleton";
import RenderPage from "@/components/global/render-page";

type Props = {};

const CreateNewProject = async (props: Props) => {
  return (
    <main className="w-full h-full pt-6">
      <Suspense fallback={<NewProjectSkeleton />}>
        <RenderPage />
      </Suspense>
    </main>
  );
};

export default CreateNewProject;

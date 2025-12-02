import React, { Suspense } from "react";
import NewProjectSkeleton from "@/components/new-project-skeleton";
import RenderPage from "@/components/render-page";
import type { Page } from "@/types";

const CreateNewProject = async ({
  searchParams,
}: {
  searchParams: { mode?: string };
}) => {
  const mode = searchParams.mode as Page;

  return (
    <main className="w-full h-full pt-6">
      <Suspense fallback={<NewProjectSkeleton />}>
        <RenderPage mode={mode} />
      </Suspense>
    </main>
  );
};

export default CreateNewProject;

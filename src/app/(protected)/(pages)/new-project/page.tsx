import React, { Suspense } from "react";
import NewProjectSkeleton from "@/components/new-project-skeleton";
import RenderPage from "@/components/render-page";
import type { Page } from "@/types";
import { authenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

const CreateNewProject = async ({
  searchParams,
}: {
  searchParams: { mode?: string };
}) => {
  const mode = (await searchParams.mode) as Page;
  const checkUser = await authenticateUser();

  if (!checkUser.user) {
    redirect("/sign-in");
  }

  // TODO
  // if (!checkUser.user.subscription) {
  //   redirect("/dashboard");
  // }

  return (
    <main className="w-full h-full pt-6">
      <Suspense fallback={<NewProjectSkeleton />}>
        <RenderPage />
      </Suspense>
    </main>
  );
};

export default CreateNewProject;

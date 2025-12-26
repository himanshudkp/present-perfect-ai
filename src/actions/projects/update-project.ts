"use server";

import { prisma } from "@/config/prisma";
import { authenticateUser } from "../user";
import type { JsonValue } from "@prisma/client/runtime/client";

export const updateProject = async (projectId: string, slides: JsonValue) => {
  try {
    const { status, user } = await authenticateUser();

    if (status !== 200 || !user)
      return { status: 403, error: "User not authenticated" };

    if (!projectId || !slides) {
      return { status: 400, error: "ProjectId and slides are required." };
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        slides,
      },
    });

    if (!updatedProject)
      return { status: 500, error: "Project does not exist." };

    return { status: 200, data: updatedProject };
  } catch (error) {
    console.error("An error occurred in updateProject():", error);
    return { status: 500, error: "An unexpected error occurred." };
  }
};

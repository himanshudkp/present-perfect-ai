"use server";

import { prisma } from "@/config/prisma";
import { authenticateUser } from "../user";

export const recoverProject = async (projectId: string) => {
  try {
    const { status, user } = await authenticateUser();

    if (status !== 200 || !user)
      return { status: 403, error: "User not authenticated" };

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        isDeleted: false,
      },
    });

    if (!updatedProject)
      return { status: 500, error: "Failed to recover projects" };

    return { status: 200, data: updatedProject };
  } catch (error) {
    console.error("An error occurred in recoverProject():", error);
    return { status: 500, error: "An unexpected error occurred." };
  }
};

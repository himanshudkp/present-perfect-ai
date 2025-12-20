"use server";

import { prisma } from "@/config/prisma";
import { authenticateUser } from "../user";

export const getProjectById = async (projectId: string) => {
  try {
    const { status, user } = await authenticateUser();

    if (status !== 200 || !user)
      return { status: 403, error: "User not authenticated" };

    const project = await prisma.project.findFirst({
      where: {
        ownerId: user.id,
        id: projectId,
      },
    });

    if (!project) return { status: 404, error: "Project does not exist." };

    return { status: 200, data: project };
  } catch (error) {
    console.error("An error occurred in getProjectById():", error);
    return { status: 500, error: "An unexpected error occurred." };
  }
};

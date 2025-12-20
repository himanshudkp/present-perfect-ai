"use server";

import { prisma } from "@/config/prisma";
import { authenticateUser } from "../user";

export const deleteProject = async (projectId: string) => {
  try {
    const { status, user } = await authenticateUser();

    if (status !== 200 || !user)
      return { status: 403, error: "User not authenticated" };

    const deletedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        isDeleted: true,
      },
    });

    if (!deletedProject)
      return { status: 500, error: "Failed to delete project." };

    return { status: 200, data: deletedProject };
  } catch (error) {
    console.error("An error occurred in deleteProject():", error);
    return { status: 500, error: "An unexpected error occurred." };
  }
};

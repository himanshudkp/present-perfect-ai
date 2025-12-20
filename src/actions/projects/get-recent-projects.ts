"use server";

import { prisma } from "@/config/prisma";
import { authenticateUser } from "../user";

export const getRecentProjects = async () => {
  try {
    const { status, user } = await authenticateUser();

    if (status !== 200 || !user)
      return { status: 403, error: "User not authenticated" };

    const recentProjects = await prisma.project.findMany({
      where: {
        ownerId: user.id,
        isDeleted: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });

    if (recentProjects.length === 0)
      return { status: 404, error: "No recently opened projects found" };

    return { status: 200, data: recentProjects };
  } catch (error) {
    console.error("An error occurred in getRecentProjects():", error);
    return { status: 500, error: "An unexpected error occurred." };
  }
};

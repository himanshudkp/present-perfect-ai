"use server";

import { prisma } from "@/config/prisma";
import { authenticateUser } from "../user";

export const getAllProjects = async () => {
  try {
    const { status, user } = await authenticateUser();

    if (status !== 200 || !user)
      return { status: 403, error: "User not authenticated" };

    const projects = await prisma.project.findMany({
      where: {
        ownerId: user.id,
        // isDeleted: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (projects.length === 0)
      return { status: 404, error: "No projects found" };

    return { status: 200, data: projects };
  } catch (error) {
    console.error("An error occurred in getAllProjects():", error);
    return { status: 500, error: "An unexpected error occurred." };
  }
};

"use server";

import { prisma } from "@/lib/prisma";
import { authenticateUser } from "./user";
import { OutlineCard } from "@/lib/types";

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

export const createProject = async (title: string, outlines: OutlineCard[]) => {
  try {
    const { status, user } = await authenticateUser();

    if (status !== 200 || !user)
      return { status: 403, error: "User not authenticated" };

    if (!title || !outlines || outlines.length === 0) {
      return { status: 400, error: "Title and outline is required." };
    }

    const allOutlines = outlines.map((outline) => outline.title);

    const project = await prisma.project.create({
      data: {
        title,
        outlines: allOutlines,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: user.id,
      },
    });

    if (!project) return { status: 500, error: "Failed to create project." };

    return { status: 200, data: project };
  } catch (error) {
    console.error("An error occurred in createProject():", error);
    return { status: 500, error: "An unexpected error occurred." };
  }
};

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

export const updateFavorite = async (projectId: string) => {
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

    const updatedProject = prisma.project.update({
      where: {
        id: projectId,
      },
      data: { isFavorite: !project.isFavorite },
    });

    return { status: 200, data: updatedProject };
  } catch (error) {
    console.error("An error occurred in markAsFavorite():", error);
    return { status: 500, error: "An unexpected error occurred." };
  }
};

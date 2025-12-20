"use server";

import type { OutlineCard } from "@/types";
import { prisma } from "@/config/prisma";
import { authenticateUser } from "../user";

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

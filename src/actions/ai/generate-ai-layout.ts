"use server";

import { prisma } from "@/config/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { generateLayoutsJson } from "./generate-layout-json";
import { EXISTING_LAYOUTS } from "@/constants";
import { generateImageUrl } from "./generate-image-url";

export const generateLayouts = async (projectId: string, theme: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }

    const user = await currentUser();
    if (!user) return { status: 401, error: "User not authenticated" };

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      return { status: 403, error: "User does not exist" };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId, isDeleted: false },
    });

    if (!project) {
      return { status: 404, error: "Project not found" };
    }

    if (!project.outlines || project.outlines.length === 0) {
      return {
        status: 400,
        error: "Project does not have any outlines",
      };
    }

    const slides = await generateLayoutsJson(project.outlines, {
      existingLayoutsSample: EXISTING_LAYOUTS,
      generateImageUrlFn: generateImageUrl,
    });

    if (!slides || !slides.data) {
      return {
        status: 500,
        error: "Failed to generate slides",
      };
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        slides: JSON.stringify(slides.data),
        theme: theme,
        updatedAt: new Date(),
      },
    });

    return {
      status: 200,
      data: updated.slides,
    };
  } catch (error) {
    console.error("Error in generateLayouts():", error);
    return { status: 500, error: "Unexpected server error", data: [] };
  }
};

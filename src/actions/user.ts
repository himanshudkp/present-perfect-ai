"use server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const authenticateUser = async () => {
  try {
    const user = await currentUser();

    if (!user)
      return {
        ok: false,
        status: 403,
      };

    const existing = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      include: {
        ownedProjects: true,
      },
    });

    if (existing) return { ok: true, status: 200, user: existing };

    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim(),
        profileImage: user.imageUrl,
      },
    });

    if (newUser) return { ok: true, status: 200, user: newUser };

    return { ok: false, status: 400 };
  } catch (error) {
    console.error("An error occurred in authenticateUser():", error);
    return { status: 500, error: "An unexpected error occurred." };
  }
};

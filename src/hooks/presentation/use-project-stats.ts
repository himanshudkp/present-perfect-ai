import { useMemo } from "react";
import type { Project } from "@/generated/prisma/client";

export const useProjectStats = (projects: Project[]) => {
  return useMemo(() => {
    const active = projects.filter((p) => !p.isDeleted).length;
    return {
      all: projects.length,
      active,
      deleted: projects.length - active,
      favorites: projects.filter((p) => p.isFavorite).length,
      sellable: projects.filter((p) => p.isSellable).length,
    };
  }, [projects]);
};

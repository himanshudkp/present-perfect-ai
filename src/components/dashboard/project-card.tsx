"use client";

import { useCallback, useMemo, useState, memo } from "react";
import { useRouter } from "next/navigation";
import { ListViewCard } from "./list-view-card";
import { GridViewCard } from "./grid-view-card";
import { showSuccess } from "@/components/toast-message";
import { THEMES } from "@/constants";
import { getTimeAgo } from "@/utils";
import { useSlideStore } from "@/store/use-slide-store";
import type { Slide } from "@/types";
import type { Project } from "@/generated/prisma/client";

interface ProjectCardProps {
  project: Project;
  viewMode: "grid" | "compact" | "list";
  onDeleteProject: (projectId: string) => Promise<void>;
  onRecoverProject: (projectId: string) => Promise<void>;
  onFavoriteProject: (projectId: string) => Promise<void>;
}

const useProjectCardActions = (
  projectId: string,
  onDeleteProject: (id: string) => Promise<void>,
  onRecoverProject: (id: string) => Promise<void>,
  onFavoriteProject: (id: string) => Promise<void>
) => {
  const [loading, setLoading] = useState(false);
  const { setSlides } = useSlideStore();
  const router = useRouter();

  const executeAction = useCallback(async (action: () => Promise<void>) => {
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    executeAction,
    handleRecoverProject: () =>
      executeAction(() => onRecoverProject(projectId)),
    handleDeleteProject: () => executeAction(() => onDeleteProject(projectId)),
    handleFavoriteProject: () =>
      executeAction(() => onFavoriteProject(projectId)),
    handleNavigation: useCallback(
      (slides: Slide[], isDeleted: boolean) => {
        if (isDeleted) return;
        setSlides(slides);
        router.push(`/presentation/${projectId}`);
      },
      [projectId, setSlides, router]
    ),
    handleCopyLink: useCallback(() => {
      navigator.clipboard.writeText(
        `${window.location.origin}/presentation/${projectId}`
      );
      showSuccess("Link copied", "Share this link with others");
    }, [projectId]),
  };
};

const ProjectCard = ({
  viewMode = "grid",
  project,
  onDeleteProject,
  onRecoverProject,
  onFavoriteProject,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const parsedSlides: Slide[] = useMemo(
    () => JSON.parse(JSON.stringify(project.slides)),
    [project.slides]
  );

  const slideCount = useMemo(
    () => (Array.isArray(parsedSlides) ? parsedSlides.length : 1),
    [parsedSlides]
  );

  const theme = useMemo(
    () => THEMES.find((t) => t.name === project.theme) || THEMES[0],
    [project.theme]
  );

  const timeAgo = useMemo(
    () => getTimeAgo(new Date(project.createdAt)),
    [project.createdAt]
  );

  const actions = useProjectCardActions(
    project.id,
    onDeleteProject,
    onRecoverProject,
    onFavoriteProject
  );

  const commonProps = {
    project,
    theme,
    parsedSlides,
    timeAgo,
    slideCount,
    isHovered,
    loading: actions.loading,
    actions,
  };

  if (viewMode === "list") {
    return (
      <ListViewCard
        {...commonProps}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      />
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GridViewCard {...commonProps} viewMode={viewMode} />
    </div>
  );
};

export default memo(ProjectCard);

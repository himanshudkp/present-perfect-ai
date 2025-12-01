"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useRouter, usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

import NoRecentProjects from "./no-recent-projects";
import CollapsedProjectItem from "./collapsed-project-item";
import ExpandedProjectItem from "./expanded-project-item";
import { Project } from "@/generated/prisma/client";
import { showError, showSuccess } from "@/components/toast";

const MOTION_VARIANTS = {
  enter: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
} as const;

const TRANSITION = { delay: 0.05, duration: 0.2 } as const;

interface RecentProjectsProps {
  recentProjects: Project[];
  maxItems?: number;
}

const RecentProjects = ({
  recentProjects,
  maxItems = 3,
}: RecentProjectsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const displayProjects = useMemo(
    () => recentProjects.slice(0, maxItems),
    [recentProjects, maxItems]
  );

  const favoriteMap = useMemo(() => {
    const map = new Set<string>();
    recentProjects.forEach((p) => p.isFavorite && map.add(p.id));
    return map;
  }, [recentProjects]);

  const currentProjectId = pathname.split("/").pop() ?? "";

  const handleProjectClick = (projectId: string) => {
    if (!projectId) {
      showError("Project not found", "Please try again.");
      return;
    }

    router.push(`/presentation/${projectId}`);
    showSuccess("Opening project", "Loading your presentation...");
  };

  if (recentProjects.length === 0) {
    return (
      <SidebarGroup className="gap-2 group-data-[state=collapsed]:hidden">
        <SidebarGroupLabel className="flex items-center gap-2 text-xs font-semibold">
          <Clock className="h-4 w-4" />
          Recent Projects
        </SidebarGroupLabel>
        <NoRecentProjects />
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="gap-2">
      <SidebarGroupLabel className="flex items-center justify-between text-xs font-semibold group-data-[state=collapsed]:hidden">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Recent Projects</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {recentProjects.length}
          </Badge>
        </div>
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1">
        <AnimatePresence mode="popLayout">
          {displayProjects.map((project, index) => {
            const isActive = project.id === currentProjectId;
            const isFavorite = favoriteMap.has(project.id);
            const noOfSlides = Array.isArray(project.slides)
              ? project.slides.length
              : 0;

            return (
              <motion.div
                key={project.id}
                layout
                {...MOTION_VARIANTS.enter}
                transition={{ ...TRANSITION, delay: index * TRANSITION.delay }}
              >
                <SidebarMenuItem>
                  <div className="group-data-[state=collapsed]:hidden">
                    <ExpandedProjectItem
                      isActive={isActive}
                      isFavorite={isFavorite}
                      createdAt={project.createdAt}
                      noOfSlides={noOfSlides}
                      title={project.title}
                      onProjectClick={() => handleProjectClick(project.id)}
                    />
                  </div>
                  <div className="group-data-[state=collapsed]:visible">
                    <CollapsedProjectItem
                      isActive={isActive}
                      isFavorite={isFavorite}
                      createdAt={project.createdAt}
                      noOfSlides={noOfSlides}
                      title={project.title}
                      onProjectClick={() => handleProjectClick(project.id)}
                    />
                  </div>
                </SidebarMenuItem>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default RecentProjects;

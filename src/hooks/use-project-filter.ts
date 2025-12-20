"use client";

import { useMemo } from "react";
import type { Project } from "@/generated/prisma/client";
import type { ProjectFilters, SortOption, TabView } from "@/types";

const FILTER_FUNCTIONS = {
  search: (project: Project, query: string) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      project.title.toLowerCase().includes(q) ||
      project.theme?.toLowerCase().includes(q) ||
      project.outlines?.some((o) => o.toLowerCase().includes(q))
    );
  },

  tab: (project: Project, tab: TabView) => {
    const tabFilters: Record<TabView, (p: Project) => boolean> = {
      active: (p) => !p.isDeleted,
      deleted: (p) => p.isDeleted,
      favorites: (p) => (p.isFavorite === true ? true : false),
      all: () => true,
    };
    return tabFilters[tab](project);
  },

  toggles: (project: Project, filters: ProjectFilters, tab: TabView) => {
    if (tab === "all") {
      if (!filters.showDeleted && project.isDeleted) return false;
      if (!filters.showActive && !project.isDeleted) return false;
    }
    if (!filters.showSellable && project.isSellable) return false;
    return true;
  },
} as const;

const SORT_FUNCTIONS: Record<SortOption, (a: Project, b: Project) => number> = {
  recent: (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  oldest: (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
  updated: (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
  "name-asc": (a, b) => a.title.localeCompare(b.title),
  "name-desc": (a, b) => b.title.localeCompare(a.title),
  slides: (a, b) =>
    (Array.isArray(b.slides) ? b.slides.length : 0) -
    (Array.isArray(a.slides) ? a.slides.length : 0),
};

export const useProjectFiltering = (
  projects: Project[],
  filters: ProjectFilters,
  activeTab: TabView,
  searchQuery: string,
  sortBy: SortOption
) => {
  const lowerQuery = useMemo(() => searchQuery.toLowerCase(), [searchQuery]);

  const filteredProjects = useMemo(() => {
    const sorted = [...projects].sort(SORT_FUNCTIONS[sortBy]);

    return sorted.filter((p) => {
      return (
        FILTER_FUNCTIONS.tab(p, activeTab) &&
        FILTER_FUNCTIONS.toggles(p, filters, activeTab) &&
        FILTER_FUNCTIONS.search(p, lowerQuery)
      );
    });
  }, [projects, filters, activeTab, lowerQuery, sortBy]);

  return filteredProjects;
};

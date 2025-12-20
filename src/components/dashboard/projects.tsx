"use client";

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3x3, LayoutGrid, List } from "lucide-react";
import { useProjectActions } from "@/hooks/use-project-actions";
import { useProjectStats } from "@/hooks/use-project-stats";
import { useProjectFiltering } from "@/hooks/use-project-filter";
import SkeletonGrid from "./skeleton-loader";
import FilterTabs from "../search-sort-filter/filter-tabs";
import SearchProjects from "../search-sort-filter/search-projects";
import SortDropdown from "../search-sort-filter/sort-dropdown";
import RefreshProjectsButton from "./refresh-projects-button";
import ResultSummary from "./result-summary";
import NoProjectsFound from "./no-projects-found";
import ProjectCard from "./project-card";
import ViewToggleButton from "./view-toggle-button";
import { cn } from "@/utils";
import { CONTAINER_VARIANTS, GRID_CLASSES } from "@/constants";

import type { Project } from "@/generated/prisma/client";
import type { ProjectFilters, SortOption, TabView, ViewMode } from "@/types";

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
} as const;

const DEFAULT_FILTERS: ProjectFilters = {
  showDeleted: false,
  showPurchased: false,
  showSellable: false,
  showActive: true,
};

interface ProjectsProps {
  projects: Project[];
  defaultView?: ViewMode;
  defaultTab?: TabView;
  filter?: TabView;
}

const Projects = ({
  projects,
  defaultView = "grid",
  defaultTab = "all",
  filter,
}: ProjectsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [activeTab, setActiveTab] = useState<TabView>(filter ?? defaultTab);
  const [filters, setFilters] = useState<ProjectFilters>(DEFAULT_FILTERS);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const { executeAction } = useProjectActions();
  const projectStats = useProjectStats(projects);

  const filteredProjects = useProjectFiltering(
    projects,
    filters,
    activeTab,
    searchQuery,
    sortBy
  );

  const activeFiltersCount =
    Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setActiveTab("all");
  };

  useEffect(() => {
    setShowSkeleton(true);
    const timeout = setTimeout(() => setShowSkeleton(false), 300);
    return () => clearTimeout(timeout);
  }, [viewMode]);

  return (
    <div className="space-y-6">
      <FilterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectCounts={projectStats}
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <SearchProjects
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            <div className="flex items-center gap-1 border rounded-md p-1">
              <ViewToggleButton
                mode="grid"
                currentMode={viewMode}
                icon={LayoutGrid}
                label="Grid view"
                onClick={setViewMode}
              />
              <ViewToggleButton
                mode="compact"
                currentMode={viewMode}
                icon={Grid3x3}
                label="Compact view"
                onClick={setViewMode}
              />
              <ViewToggleButton
                mode="list"
                currentMode={viewMode}
                icon={List}
                label="List view"
                onClick={setViewMode}
              />
            </div>
            <RefreshProjectsButton
              showSkeleton={showSkeleton}
              setShowSkeleton={setShowSkeleton}
            />
          </div>
        </div>
      </div>

      <ResultSummary
        sortBy={sortBy}
        activeTab={activeTab}
        searchQuery={searchQuery}
        filteredProjectsCount={filteredProjects.length}
      />

      <AnimatePresence mode="popLayout">
        {showSkeleton ? (
          <SkeletonGrid viewMode={viewMode} />
        ) : filteredProjects.length > 0 ? (
          <motion.div
            className={cn(GRID_CLASSES[viewMode])}
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                variants={ITEM_VARIANTS}
                layout
                layoutId={project.id}
                custom={i}
                exit="exit"
              >
                <ProjectCard
                  project={project}
                  viewMode={viewMode}
                  onDeleteProject={(id) => executeAction(id, "delete")}
                  onRecoverProject={(id) => executeAction(id, "recover")}
                  onFavoriteProject={(id) => executeAction(id, "favorite")}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <NoProjectsFound
            searchQuery={searchQuery}
            activeFiltersCount={activeFiltersCount}
            activeTab={activeTab}
            onClearFilters={handleClearFilters}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(Projects);

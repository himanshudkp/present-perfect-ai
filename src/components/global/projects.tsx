"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants } from "@/lib/constants";
import ProjectCard from "./project-card";
import type { Project } from "@/generated/prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  LayoutGrid,
  List,
  Calendar,
  Sparkles,
  Filter,
  X,
  ArrowUpDown,
  Star,
  Inbox,
  TrendingUp,
  Zap,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ViewMode = "grid" | "compact" | "list";
type SortOption =
  | "recent"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "slides"
  | "updated";
type TabView = "all" | "active" | "deleted" | "favorites";

type Props = {
  projects: Project[];
  defaultView?: ViewMode;
  defaultTab?: TabView;
  showFilters?: boolean;
  showViewToggle?: boolean;
  showTabs?: boolean;
  onRefresh?: () => void;
};

const Projects = ({
  projects,
  defaultView = "grid",
  defaultTab = "all",
  showFilters = true,
  showViewToggle = true,
  showTabs = true,
  onRefresh,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [activeTab, setActiveTab] = useState<TabView>(defaultTab);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState({
    showDeleted: false,
    showPurchased: false,
    showSellable: false,
    showActive: true,
  });

  const toggleFilter = useCallback((key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      showDeleted: false,
      showPurchased: false,
      showSellable: false,
      showActive: true,
    });
    setSearchQuery("");
    setActiveTab("all");
  }, []);

  const handleFavoriteToggle = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.showDeleted) count++;
    if (filters.showPurchased) count++;
    if (filters.showSellable) count++;
    if (!filters.showActive) count++;
    if (searchQuery) count++;
    return count;
  }, [filters, searchQuery]);

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      // Tab filtering
      const isActive = !project.isDeleted;
      const isDeleted = project.isDeleted;
      const isFavorite = favoriteIds.has(project.id);

      if (activeTab === "active" && !isActive) return false;
      if (activeTab === "deleted" && !isDeleted) return false;
      if (activeTab === "favorites" && !isFavorite) return false;

      // Status filters (only apply in "all" tab)
      if (activeTab === "all") {
        if (isDeleted && !filters.showDeleted) return false;
        if (isActive && !filters.showActive && !isDeleted) return false;
      }

      const isSellable = project.isSellable || false;
      if (isSellable && !filters.showSellable) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.theme?.toLowerCase().includes(query) ||
          project.outlines?.some((outline: string) =>
            outline.toLowerCase().includes(query)
          )
        );
      }
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "slides":
          const aSlides = Array.isArray(a.slides) ? a.slides.length : 0;
          const bSlides = Array.isArray(b.slides) ? b.slides.length : 0;
          return bSlides - aSlides;
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchQuery, sortBy, filters, activeTab, favoriteIds]);

  const projectCounts = useMemo(() => {
    return {
      all: projects.length,
      active: projects.filter((p) => !p.isDeleted).length,
      deleted: projects.filter((p) => p.isDeleted).length,
      favorites: projects.filter((p) => favoriteIds.has(p.id)).length,
      sellable: projects.filter((p) => p.isSellable).length,
    };
  }, [projects, favoriteIds]);

  const gridClasses = {
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    compact:
      "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3",
    list: "flex flex-col gap-3",
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  } as const;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      {showTabs && (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabView)}
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="all" className="gap-2">
              <Inbox className="h-4 w-4" />
              <span>All</span>
              <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                {projectCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2">
              <Zap className="h-4 w-4" />
              <span>Active</span>
              <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                {projectCounts.active}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Star className="h-4 w-4" />
              <span>Favorites</span>
              <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                {projectCounts.favorites}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="deleted" className="gap-2">
              <X className="h-4 w-4" />
              <span>Trash</span>
              <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                {projectCounts.deleted}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Filters & Controls */}
      {showFilters && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, theme, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Filters Dropdown */}
              {activeTab === "all" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-1 px-1.5 py-0 h-5 text-xs"
                        >
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filters.showActive}
                      onCheckedChange={() => toggleFilter("showActive")}
                    >
                      Active Projects
                      <span className="ml-auto text-xs text-muted-foreground">
                        {projectCounts.active}
                      </span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.showDeleted}
                      onCheckedChange={() => toggleFilter("showDeleted")}
                    >
                      Deleted Projects
                      <span className="ml-auto text-xs text-muted-foreground">
                        {projectCounts.deleted}
                      </span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">
                      Marketplace
                    </DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={filters.showSellable}
                      onCheckedChange={() => toggleFilter("showSellable")}
                    >
                      For Sale
                      <span className="ml-auto text-xs text-muted-foreground">
                        {projectCounts.sellable}
                      </span>
                    </DropdownMenuCheckboxItem>
                    {activeFiltersCount > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="w-full justify-start h-8 px-2"
                        >
                          <X className="h-3 w-3 mr-2" />
                          Clear Filters
                        </Button>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as SortOption)}
              >
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Most Recent
                    </span>
                  </SelectItem>
                  <SelectItem value="updated">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Recently Updated
                    </span>
                  </SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="slides">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Most Slides
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              {showViewToggle && (
                <div className="flex items-center gap-1 border rounded-md p-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === "grid" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="h-8 w-8 p-0"
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Grid view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            viewMode === "compact" ? "secondary" : "ghost"
                          }
                          size="sm"
                          onClick={() => setViewMode("compact")}
                          className="h-8 w-8 p-0"
                        >
                          <Grid3x3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Compact view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === "list" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="h-8 w-8 p-0"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>List view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {/* Refresh */}
              {onRefresh && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        className="h-9 w-9 p-0"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 flex-wrap"
            >
              <span className="text-xs text-muted-foreground">
                Active filters:
              </span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchQuery.substring(0, 20)}
                  {searchQuery.length > 20 ? "..." : ""}"
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
              {filters.showDeleted && (
                <Badge variant="secondary" className="gap-1">
                  Deleted
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleFilter("showDeleted")}
                  />
                </Badge>
              )}
              {filters.showSellable && (
                <Badge variant="secondary" className="gap-1">
                  For Sale
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleFilter("showSellable")}
                  />
                </Badge>
              )}
              {!filters.showActive && (
                <Badge variant="secondary" className="gap-1">
                  Hide Active
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleFilter("showActive")}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 text-xs px-2"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
          {searchQuery && " found"}
          {activeTab !== "all" && ` in ${activeTab}`}
        </span>
        {filteredProjects.length > 0 && (
          <span className="text-muted-foreground text-xs">
            Sorted by {sortBy.replace("-", " ")}
          </span>
        )}
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="popLayout">
        {filteredProjects.length > 0 ? (
          <motion.div
            className={cn(gridClasses[viewMode])}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project, index) => {
              const {
                createdAt,
                updatedAt,
                id,
                isDeleted,
                slides,
                theme,
                title,
                isSellable,
              } = project;
              const created = formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
              });

              return (
                <motion.div
                  key={id}
                  variants={itemVariants}
                  layout
                  layoutId={id}
                  custom={index}
                  exit="exit"
                >
                  <ProjectCard
                    projectId={id}
                    title={title}
                    createdAt={created}
                    updatedAt={
                      updatedAt
                        ? formatDistanceToNow(new Date(updatedAt), {
                            addSuffix: true,
                          })
                        : undefined
                    }
                    isDeleted={isDeleted}
                    isFavorite={favoriteIds.has(id)}
                    isSellable={isSellable}
                    slidesData={slides}
                    themeName={theme}
                    viewMode={viewMode}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/20"
          >
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery || activeFiltersCount > 0
                ? "Try adjusting your search terms or filters to find what you're looking for"
                : activeTab === "favorites"
                ? "You haven't favorited any projects yet. Star projects to see them here!"
                : activeTab === "deleted"
                ? "No deleted projects. Deleted items will appear here for recovery."
                : "Create your first project to get started with presentations"}
            </p>
            {(searchQuery || activeFiltersCount > 0) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear all filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;

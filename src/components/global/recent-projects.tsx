"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Project } from "@/generated/prisma/client";
import { useSlideStore } from "@/store/use-slide-store";
import { JsonValue } from "@prisma/client/runtime/library";
import { useRouter, usePathname } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Clock,
  FileText,
  MoreHorizontal,
  ExternalLink,
  Star,
  Trash2,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

type Props = {
  recentProjects: Project[];
  maxItems?: number;
  showEmpty?: boolean;
  onViewAll?: () => void;
};

const RecentProjects = ({
  recentProjects,
  maxItems = 5,
  showEmpty = true,
  onViewAll,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setSlides } = useSlideStore();
  const { open: sidebarOpen } = useSidebar();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const parsedProjectsMap = useMemo(() => {
    return new Map(
      recentProjects.map((project) => [
        project.id,
        JSON.parse(JSON.stringify(project.slides)),
      ])
    );
  }, [recentProjects]);

  const handleProjectClick = useCallback(
    (projectId: string, slides: JsonValue) => {
      if (!projectId || !slides) {
        toast.error("Project not found", {
          description: "Please try again.",
        });
        return;
      }

      try {
        setSlides(JSON.parse(JSON.stringify(slides)));
        router.push(`/ppt/${projectId}`);
        toast.success("Opening project", {
          description: "Loading your presentation...",
        });
      } catch (error) {
        console.error("Failed to open project:", error);
        toast.error("Failed to open project", {
          description: "Please try again.",
        });
      }
    },
    [setSlides, router]
  );

  const handleFavoriteToggle = useCallback(
    (projectId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setFavorites((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(projectId)) {
          newSet.delete(projectId);
          toast.success("Removed from favorites");
        } else {
          newSet.add(projectId);
          toast.success("Added to favorites");
        }
        return newSet;
      });
    },
    []
  );

  const handleDelete = useCallback((projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete
    toast.info("Delete feature", {
      description: "This will move the project to trash",
    });
  }, []);

  const isCurrentProject = useCallback(
    (projectId: string) => {
      return pathname.includes(projectId);
    },
    [pathname]
  );

  // Empty state
  if (recentProjects.length === 0) {
    if (!showEmpty) return null;

    return (
      <SidebarGroup className="gap-2">
        <SidebarGroupLabel className="flex items-center gap-2 text-xs font-semibold">
          <Clock className="h-4 w-4" />
          {sidebarOpen && "Recent Projects"}
        </SidebarGroupLabel>

        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-3 p-4 rounded-lg border-2 border-dashed border-border/50 text-center space-y-2"
          >
            <FolderOpen className="h-8 w-8 mx-auto text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">No recent projects</p>
            <p className="text-[10px] text-muted-foreground/60">
              Create your first project to get started
            </p>
          </motion.div>
        )}
      </SidebarGroup>
    );
  }

  const displayProjects = recentProjects.slice(0, maxItems);

  return (
    <SidebarGroup className="gap-2">
      <SidebarGroupLabel className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {sidebarOpen && (
            <>
              <span>Recent Projects</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {recentProjects.length}
              </Badge>
            </>
          )}
        </div>

        {sidebarOpen && recentProjects.length > maxItems && onViewAll && (
          <SidebarGroupAction onClick={onViewAll} title="View all projects">
            <MoreHorizontal className="h-4 w-4" />
          </SidebarGroupAction>
        )}
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1">
        <AnimatePresence mode="popLayout">
          {displayProjects.map((project, index) => {
            const { id, title, slides, createdAt, theme } = project;
            const isActive = isCurrentProject(id);
            const isFavorite = favorites.has(id);
            const isHovered = hoveredId === id;
            const slideCount = Array.isArray(slides) ? slides.length : 0;

            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredId(id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <SidebarMenuItem>
                  {/* Collapsed View - Show tooltip with full details */}
                  {!sidebarOpen ? (
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={cn(
                              "transition-all duration-200 relative",
                              isActive && [
                                "bg-primary/10 text-primary",
                                "before:absolute before:left-0 before:top-0 before:bottom-0",
                                "before:w-1 before:bg-primary before:rounded-r-full",
                              ],
                              !isActive && "hover:bg-accent/50"
                            )}
                          >
                            <Button
                              variant="ghost"
                              onClick={() => handleProjectClick(id, slides)}
                              className="w-full h-10 justify-center p-0"
                              aria-label={`Open project: ${title}`}
                            >
                              <div className="relative">
                                <FileText
                                  className={cn(
                                    "h-5 w-5",
                                    isActive
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  )}
                                />
                                {isFavorite && (
                                  <Star className="absolute -top-1 -right-1 h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
                                )}
                              </div>
                            </Button>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-semibold">{title}</p>
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <p>{slideCount} slides</p>
                              <p>
                                {formatDistanceToNow(new Date(createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    // Expanded View - Show full details
                    <SidebarMenuButton
                      asChild
                      tooltip={title}
                      isActive={isActive}
                      className={cn(
                        "transition-all duration-200 group relative px-2",
                        isActive && [
                          "bg-primary/10 text-primary",
                          "before:absolute before:left-0 before:top-0 before:bottom-0",
                          "before:w-1 before:bg-primary before:rounded-r-full",
                        ],
                        !isActive && "hover:bg-accent/50 hover:translate-x-1"
                      )}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => handleProjectClick(id, slides)}
                        className="w-full justify-start gap-2 px-2 py-2 h-auto text-xs font-normal"
                        title={title}
                        aria-label={`Open project: ${title}`}
                      >
                        <div
                          className={cn(
                            "h-8 w-8 shrink-0 rounded-md flex items-center justify-center",
                            "transition-all duration-200",
                            isActive
                              ? "bg-primary/20 text-primary"
                              : "bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary"
                          )}
                        >
                          <FileText className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "truncate text-xs font-medium transition-all",
                                isActive && "font-semibold"
                              )}
                            >
                              {title}
                            </span>
                            {isFavorite && (
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 shrink-0" />
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{slideCount} slides</span>
                            <span>•</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="truncate">
                                    {formatDistanceToNow(new Date(createdAt), {
                                      addSuffix: true,
                                    })}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>
                                    Created:{" "}
                                    {new Date(createdAt).toLocaleDateString()}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        {/* Actions Menu - Only in expanded view */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-background"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" side="right">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleProjectClick(id, slides);
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => handleFavoriteToggle(id, e)}
                                  >
                                    <Star
                                      className={cn(
                                        "h-4 w-4 mr-2",
                                        isFavorite && "fill-current"
                                      )}
                                    />
                                    {isFavorite ? "Unfavorite" : "Favorite"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) => handleDelete(id, e)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </SidebarMenu>

      {/* View All Link - Only when expanded */}
      {sidebarOpen && recentProjects.length > maxItems && onViewAll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 pt-2"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="w-full justify-start gap-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
          >
            <Sparkles className="h-3.5 w-3.5" />
            View all {recentProjects.length} projects
          </Button>
        </motion.div>
      )}
    </SidebarGroup>
  );
};

export default RecentProjects;

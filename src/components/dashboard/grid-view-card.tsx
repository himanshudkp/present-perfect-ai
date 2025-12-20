"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Clock, Copy, Eye, FileText, Star } from "lucide-react";
import IconButton from "./icon-button";
import ActionButtons from "./action-buttons";
import StatusBadges from "./status-badges";
import { LoadingOverlay } from "./loading-overlay";
import ThumbnailPreview from "./thumbnail-preview";
import { ITEM_VARIANTS } from "@/constants";
import { cn } from "@/utils";
import type { Project } from "@/generated/prisma/client";
import type { Slide } from "@/types";

const HOVER_OVERLAY_VARIANTS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
} as const;

interface GridViewCardProps {
  project: Project;
  theme: any;
  parsedSlides: Slide[];
  timeAgo: string;
  slideCount: number;
  viewMode: "grid" | "compact";
  isHovered: boolean;
  loading: boolean;
  actions: any;
}

export const GridViewCard = memo(
  ({
    project,
    theme,
    parsedSlides,
    timeAgo,
    slideCount,
    viewMode,
    isHovered,
    loading,
    actions,
  }: GridViewCardProps) => (
    <motion.div
      variants={ITEM_VARIANTS}
      layout
      className={cn(
        "group relative w-full flex flex-col rounded-xl overflow-hidden transition-all duration-300",
        "border bg-card",
        isHovered && !project.isDeleted
          ? "border-primary/50 shadow-xl shadow-primary/10 scale-[1.02]"
          : "border-border/50 shadow-sm hover:shadow-md",
        project.isDeleted && "opacity-60 hover:opacity-100"
      )}
    >
      <div className="relative aspect-video bg-muted">
        <div
          className="absolute inset-0 cursor-pointer group/thumbnail"
          onClick={() =>
            actions.handleNavigation(parsedSlides, project.isDeleted)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              actions.handleNavigation(parsedSlides, project.isDeleted);
          }}
          aria-label={`Open project: ${project.title}`}
        >
          <ThumbnailPreview slides={parsedSlides} theme={theme} />

          {viewMode !== "compact" && (
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/thumbnail:opacity-100 transition-all duration-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isHovered ? 1 : 0.8,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Eye className="h-4 w-4 text-white" />
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white text-xs">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="font-medium">{slideCount} slides</span>
                </div>
                <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white text-[10px]">
                  {theme.name}
                </Badge>
              </div>
            </div>
          )}

          <StatusBadges
            isFavorite={project.isFavorite}
            isDeleted={project.isDeleted}
            viewMode={viewMode}
          />
        </div>

        <AnimatePresence>
          {isHovered && !project.isDeleted && (
            <motion.div
              {...HOVER_OVERLAY_VARIANTS}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2"
            >
              <div className="flex items-center gap-1 bg-background/95 backdrop-blur-md border rounded-lg shadow-lg p-1">
                <IconButton
                  icon={Star}
                  label={project.isFavorite ? "Unfavorite" : "Favorite"}
                  isFilled={project.isFavorite === true ? true : false}
                  onClick={actions.handleFavoriteProject}
                />
                <IconButton
                  icon={Copy}
                  label="Copy Link"
                  onClick={actions.handleCopyLink}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 space-y-3">
        <h3
          className="font-semibold text-sm text-foreground line-clamp-2 leading-tight cursor-pointer hover:text-primary transition-colors"
          onClick={() =>
            actions.handleNavigation(parsedSlides, project.isDeleted)
          }
        >
          {project.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{timeAgo}</span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <ActionButtons
            isDeleted={project.isDeleted}
            isHovered={isHovered}
            isFavorite={project.isFavorite === true ? true : false}
            loading={loading}
            onFavorite={actions.handleFavoriteProject}
            onCopyLink={actions.handleCopyLink}
            onNavigate={() =>
              actions.handleNavigation(parsedSlides, project.isDeleted)
            }
            onDelete={actions.handleDeleteProject}
            onRecover={actions.handleRecoverProject}
            onExport={() => {}}
          />
        </div>
      </div>

      <AnimatePresence>
        {loading && <LoadingOverlay isDeleted={project.isDeleted} />}
      </AnimatePresence>
    </motion.div>
  )
);

GridViewCard.displayName = "GridViewCard";

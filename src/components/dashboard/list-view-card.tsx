"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ITEM_VARIANTS } from "@/utils/constants";
import { Clock, FileText, Eye } from "lucide-react";
import StatusBadges from "./status-badges";
import { LoadingOverlay } from "./loading-overlay";
import type { Project } from "@/generated/prisma/client";
import type { Slide } from "@/types";
import { cn } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import ActionButtons from "./action-buttons";
import ThumbnailPreview from "./thumbnail-preview";

const SELECTION_BAR_VARIANTS = {
  initial: { scaleY: 0 },
  animate: { scaleY: 1 },
  exit: { scaleY: 0 },
} as const;

interface ListViewCardProps {
  project: Project;
  theme: any;
  parsedSlides: Slide[];
  timeAgo: string;
  slideCount: number;
  isHovered: boolean;
  loading: boolean;
  actions: any;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export const ListViewCard = ({
  project,
  theme,
  parsedSlides,
  timeAgo,
  slideCount,
  isHovered,
  loading,
  actions,
  onHoverStart,
  onHoverEnd,
}: ListViewCardProps) => (
  <motion.div
    variants={ITEM_VARIANTS}
    layout
    onHoverStart={onHoverStart}
    onHoverEnd={onHoverEnd}
    className={cn(
      "group relative w-full flex items-center gap-4 rounded-xl p-4 transition-all duration-300",
      "border bg-card",
      isHovered && !project.isDeleted
        ? "border-primary/50 shadow-lg shadow-primary/10"
        : "border-border/50 hover:border-border",
      project.isDeleted && "opacity-60 hover:opacity-100"
    )}
  >
    <AnimatePresence>
      {isHovered && !project.isDeleted && (
        <motion.div
          {...SELECTION_BAR_VARIANTS}
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl origin-top"
        />
      )}
    </AnimatePresence>

    <div
      className="relative w-32 h-20 shrink-0 cursor-pointer rounded-lg overflow-hidden group/thumb"
      onClick={() => actions.handleNavigation(parsedSlides, project.isDeleted)}
    >
      <ThumbnailPreview slides={parsedSlides} theme={theme} />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
        <Eye className="h-5 w-5 text-white" />
      </div>
    </div>

    <div className="flex-1 min-w-0 space-y-1.5">
      <StatusBadges
        isFavorite={project.isFavorite}
        isDeleted={project.isDeleted}
        viewMode="list"
        position="list"
      />
      <h3
        className="font-semibold text-base text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
        onClick={() =>
          actions.handleNavigation(parsedSlides, project.isDeleted)
        }
      >
        {project.title}
      </h3>
      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeAgo}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {slideCount} {slideCount === 1 ? "slide" : "slides"}
        </span>
        <span>•</span>
        <Badge variant="outline" className="text-[10px] py-0 px-1.5">
          {theme.name}
        </Badge>
      </div>
    </div>

    <div className="flex items-center gap-1 shrink-0">
      <ActionButtons
        isDeleted={project.isDeleted}
        isHovered={isHovered}
        isFavorite={!!project.isFavorite}
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

    <AnimatePresence>
      {loading && <LoadingOverlay isDeleted={project.isDeleted} />}
    </AnimatePresence>
  </motion.div>
);

export default memo(ListViewCard);

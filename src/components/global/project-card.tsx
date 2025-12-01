"use client";

import React, { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { itemVariants, THEMES } from "@/constants";
import { useSlideStore } from "@/store/use-slide-store";
import { cn, getTimeAgo } from "@/utils";
import { useRouter } from "next/navigation";
import ThumbnailPreview from "./thumbnail-preview";
import AlertDialogBox from "./alert-dialog-box";
import { Button } from "../ui/button";
import { showSuccess, showError } from "@/components/toast";
import { deleteProject, recoverProject } from "@/actions/project";
import {
  RotateCcw,
  MoreVertical,
  ExternalLink,
  Copy,
  Star,
  Share2,
  Download,
  Trash2,
  Eye,
  Clock,
  FileText,
  Sparkles,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import type { JsonValue } from "@/generated/prisma/internal/prismaNamespace";

type Props = {
  projectId: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
  isFavorite?: boolean;
  isPurchased?: boolean;
  isSellable?: boolean;
  slidesData: JsonValue;
  themeName: string;
  viewMode?: "grid" | "compact" | "list";
  onFavoriteToggle?: (id: string) => void;
};

const ProjectCard = ({
  createdAt,
  updatedAt,
  isDeleted,
  isFavorite,
  isPurchased,
  isSellable,
  projectId,
  slidesData,
  title,
  themeName,
  viewMode = "grid",
  onFavoriteToggle,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { setSlides } = useSlideStore();
  const router = useRouter();

  const theme = useMemo(() => {
    return THEMES.find((theme) => theme.name === themeName) || THEMES[0];
  }, [themeName]);

  const parsedSlides = useMemo(() => {
    return JSON.parse(JSON.stringify(slidesData));
  }, [slidesData]);

  const slideCount = useMemo(() => {
    return Array.isArray(parsedSlides) ? parsedSlides.length : 1;
  }, [parsedSlides]);

  const handleNavigation = useCallback(() => {
    if (isDeleted) return;
    setSlides(parsedSlides);
    router.push(`/ppt/${projectId}`);
  }, [parsedSlides, projectId, setSlides, router, isDeleted]);

  const handleRecoverProject = useCallback(async () => {
    setLoading(true);
    try {
      const response = await recoverProject(projectId);
      if (response.status !== 200) {
        showError(
          "Failed to recover",
          response.error || "Something went wrong"
        );
        return;
      }
      setOpen(false);
      router.refresh();
      showSuccess("Project recovered", "Your project has been restored");
    } catch (error) {
      console.error(error);
      showError("Something went wrong", "Please try again");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  const handleDeleteProject = useCallback(async () => {
    setLoading(true);
    try {
      const response = await deleteProject(projectId);
      if (response.status !== 200) {
        showError("Failed to delete", response.error || "Something went wrong");
        return;
      }
      setOpen(false);
      router.refresh();
      showSuccess("Moved to trash", "You can recover it from trash");
    } catch (error) {
      console.error(error);
      showError("Something went wrong", "Please try again");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/ppt/${projectId}`);
    showSuccess("Link copied", "Share this link with others");
  }, [projectId]);

  const handleDuplicate = useCallback(() => {
    showError("Coming soon", "Duplicate feature is in development");
  }, []);

  const handleShare = useCallback(() => {
    showError("Coming soon", "Share feature is in development");
  }, []);

  const handleExport = useCallback(() => {
    showError("Coming soon", "Export feature is in development");
  }, []);

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onFavoriteToggle) {
        onFavoriteToggle(projectId);
      }
      showSuccess(isFavorite ? "Removed from favorites" : "Added to favorites");
    },
    [projectId, isFavorite, onFavoriteToggle]
  );

  // List view rendering
  if (viewMode === "list") {
    return (
      <motion.div
        variants={itemVariants}
        layout
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "group relative w-full flex items-center gap-4 rounded-xl p-4 transition-all duration-300",
          "border bg-card",
          isHovered && !isDeleted
            ? "border-primary/50 shadow-lg shadow-primary/10"
            : "border-border/50 hover:border-border",
          isDeleted && "opacity-60 hover:opacity-100"
        )}
      >
        {/* Selection bar */}
        <AnimatePresence>
          {isHovered && !isDeleted && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl origin-top"
            />
          )}
        </AnimatePresence>

        {/* Thumbnail */}
        <div
          className="relative w-32 h-20 shrink-0 cursor-pointer rounded-lg overflow-hidden group/thumb"
          onClick={handleNavigation}
        >
          <ThumbnailPreview slides={parsedSlides} theme={theme} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
            <Eye className="h-5 w-5 text-white" />
          </div>
          {isDeleted && (
            <Badge
              variant="destructive"
              className="absolute top-1 right-1 text-[10px] px-1.5 py-0"
            >
              Deleted
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-base text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                onClick={handleNavigation}
              >
                {title}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {getTimeAgo(new Date(createdAt))}
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

            {/* Status badges */}
            <div className="flex items-center gap-1 shrink-0">
              {isFavorite && (
                <Badge
                  variant="secondary"
                  className="text-[10px] py-0.5 px-2 gap-1"
                >
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  Favorite
                </Badge>
              )}
              {isPurchased && (
                <Badge variant="secondary" className="text-[10px] py-0.5 px-2">
                  Purchased
                </Badge>
              )}
              {isSellable && (
                <Badge
                  variant="secondary"
                  className="text-[10px] py-0.5 px-2 gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  For Sale
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <AnimatePresence>
            {isHovered && !isDeleted && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleFavorite}
                        className="h-8 w-8 p-0"
                      >
                        <Star
                          className={cn(
                            "h-4 w-4 transition-all",
                            isFavorite && "fill-current text-yellow-500"
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isFavorite ? "Unfavorite" : "Favorite"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyLink}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Link</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )}
          </AnimatePresence>

          {isDeleted ? (
            <AlertDialogBox
              variant="success"
              title="Recover Project?"
              description="This will recover your project and restore all your data."
              open={open}
              onOpenChange={setOpen}
              loading={loading}
              onClick={handleRecoverProject}
              actionLabel="Recover Project"
              customIcon={<RotateCcw className="h-5 w-5" />}
            >
              <Button size="sm" variant="outline" className="gap-1.5">
                <RotateCcw className="w-4 h-4" />
                Recover
              </Button>
            </AlertDialogBox>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleNavigation}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Loading overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">
                  {isDeleted ? "Recovering..." : "Deleting..."}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Grid/Compact view rendering
  return (
    <motion.div
      variants={itemVariants}
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "group relative w-full flex flex-col rounded-xl overflow-hidden transition-all duration-300",
        "border bg-card",
        isHovered && !isDeleted
          ? "border-primary/50 shadow-xl shadow-primary/10 scale-[1.02]"
          : "border-border/50 shadow-sm hover:shadow-md",
        isDeleted && "opacity-60 hover:opacity-100"
      )}
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-video bg-muted">
        <div
          className="absolute inset-0 cursor-pointer group/thumbnail"
          onClick={handleNavigation}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleNavigation();
            }
          }}
          aria-label={`Open project: ${title}`}
        >
          <ThumbnailPreview slides={parsedSlides} theme={theme} />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/thumbnail:opacity-100 transition-all duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isHovered ? 1 : 0.8,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-lg"
              >
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Open Project
                </span>
              </motion.div>
            </div>

            {/* Info overlay at bottom */}
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

          {/* Status badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {isDeleted && (
              <Badge
                variant="destructive"
                className="text-[10px] px-2 py-0.5 shadow-lg"
              >
                Deleted
              </Badge>
            )}
            {isFavorite && (
              <Badge className="bg-white/90 backdrop-blur-sm text-yellow-600 border-yellow-200 text-[10px] px-2 py-0.5 gap-1 shadow-lg">
                <Star className="h-3 w-3 fill-current" />
                Favorite
              </Badge>
            )}
          </div>

          {/* Purchased/Sellable indicators */}
          {(isPurchased || isSellable) && (
            <div className="absolute top-2 left-2 flex gap-1">
              {isPurchased && (
                <Badge className="bg-blue-500/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 shadow-lg">
                  Purchased
                </Badge>
              )}
              {isSellable && (
                <Badge className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 gap-1 shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  For Sale
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Quick action buttons */}
        <AnimatePresence>
          {isHovered && !isDeleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background/95 backdrop-blur-md border rounded-lg shadow-lg p-1"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFavorite}
                      className="h-7 w-7 p-0 hover:bg-accent"
                    >
                      <Star
                        className={cn(
                          "h-3.5 w-3.5 transition-all",
                          isFavorite && "fill-current text-yellow-500"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFavorite ? "Unfavorite" : "Favorite"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyLink}
                      className="h-7 w-7 p-0 hover:bg-accent"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy Link</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="h-7 w-7 p-0 hover:bg-accent"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title and Menu */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-semibold text-sm text-foreground line-clamp-2 leading-tight cursor-pointer hover:text-primary transition-colors flex-1"
            onClick={handleNavigation}
          >
            {title}
          </h3>

          {!isDeleted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0 shrink-0 transition-all",
                    isHovered
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleNavigation}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{getTimeAgo(new Date(createdAt))}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          {isDeleted ? (
            <AlertDialogBox
              variant="success"
              title="Recover Project?"
              description="This will recover your project and restore all your data."
              open={open}
              onOpenChange={setOpen}
              loading={loading}
              onClick={handleRecoverProject}
              actionLabel="Recover Project"
              customIcon={<RotateCcw className="h-5 w-5" />}
            >
              <Button size="sm" variant="outline" className="gap-1.5 w-full">
                <RotateCcw className="w-4 h-4" />
                Recover
              </Button>
            </AlertDialogBox>
          ) : (
            <>
              <Button
                size="sm"
                onClick={handleNavigation}
                className="flex-1 gap-1.5 font-medium"
              >
                <Eye className="w-3.5 h-3.5" />
                Open
              </Button>
              <AlertDialogBox
                open={open}
                onOpenChange={setOpen}
                variant="destructive"
                title="Delete Project?"
                description="This will move your project to trash. You can recover it later."
                actionLabel="Delete"
                loading={loading}
                onClick={handleDeleteProject}
              >
                <Button variant="outline" size="sm" className="w-9 p-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogBox>
            </>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-foreground">
                {isDeleted ? "Recovering..." : "Deleting..."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectCard;

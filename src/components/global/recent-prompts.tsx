"use client";

import { usePromptStore } from "@/store/use-prompt-store";
import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/constants";
import { Card } from "../ui/card";
import { timeAgo, cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useCreativeAiStore } from "@/store/use-creative-ai-store";
import { showError, showSuccess } from "@/lib/toast";
import {
  Clock,
  Sparkles,
  Edit3,
  Trash2,
  FileText,
  Calendar,
  MoreVertical,
  Copy,
  ExternalLink,
  AlertCircle,
  Layers,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
} as const;

type Props = {
  onLoadPrompt?: (id: string) => void;
  showActions?: boolean;
  maxDisplay?: number;
};

const RecentPrompts = ({
  onLoadPrompt,
  showActions = true,
  maxDisplay,
}: Props) => {
  const { prompts, setPage, deletePrompt, clearPrompts } = usePromptStore();
  const { addMultipleOutlines, setCurrentAIPrompt } = useCreativeAiStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const displayPrompts = maxDisplay ? prompts.slice(0, maxDisplay) : prompts;

  // ✅ LOAD/EDIT PROMPT
  const handleEdit = useCallback(
    (id: string) => {
      const prompt = prompts.find((p) => p.id === id);
      if (!prompt) {
        showError("Prompt not found", "This prompt may have been deleted.");
        return;
      }

      const { outlines, title } = prompt;

      // Convert to OutlineCard format if needed
      const formattedOutlines = outlines.map((outline) => ({
        id: outline.id || crypto.randomUUID(),
        title: outline.title,
        order: outline.order,
      }));

      setPage("creative-ai");
      addMultipleOutlines(formattedOutlines);
      setCurrentAIPrompt(title);

      showSuccess("Prompt loaded", "Continue editing your presentation");

      // Optional callback
      if (onLoadPrompt) {
        onLoadPrompt(id);
      }
    },
    [prompts, setPage, addMultipleOutlines, setCurrentAIPrompt, onLoadPrompt]
  );

  // ✅ DELETE WITH CONFIRMATION
  const handleDelete = useCallback(
    async (id: string) => {
      if (showDeleteConfirm !== id) {
        setShowDeleteConfirm(id);
        setTimeout(() => setShowDeleteConfirm(null), 3000);
        return;
      }

      setDeletingId(id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      deletePrompt(id);
      setDeletingId(null);
      setShowDeleteConfirm(null);
      showSuccess("Prompt deleted", "Removed from your history");
    },
    [deletePrompt, showDeleteConfirm]
  );

  // ✅ DUPLICATE PROMPT
  const handleDuplicate = useCallback(
    (id: string) => {
      const prompt = prompts.find((p) => p.id === id);
      if (!prompt) return;

      const duplicated = {
        ...prompt,
        id: crypto.randomUUID(),
        title: `${prompt.title} (Copy)`,
        createdAt: new Date(),
      };

      // Note: You'll need to add this to your store
      // For now, we'll just load it
      const formattedOutlines = prompt.outlines.map((outline) => ({
        id: outline.id || crypto.randomUUID(),
        title: outline.title,
        order: outline.order,
      }));

      addMultipleOutlines(formattedOutlines);
      setCurrentAIPrompt(duplicated.title);
      setPage("creative-ai");

      showSuccess("Prompt duplicated", "Ready to customize");
    },
    [prompts, addMultipleOutlines, setCurrentAIPrompt, setPage]
  );

  // ✅ CLEAR ALL
  const handleClearAll = useCallback(() => {
    if (
      window.confirm(
        `Delete all ${prompts.length} prompts? This cannot be undone.`
      )
    ) {
      clearPrompts();
      showSuccess("All prompts cleared", "Your history is now empty");
    }
  }, [clearPrompts, prompts.length]);

  // ✅ EMPTY STATE
  if (prompts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/20"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        </motion.div>
        <h3 className="text-xl font-bold mb-2">No Recent Projects</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          Your recently created presentations will appear here
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} className="space-y-6 mt-16 w-full">
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Clock className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Your Recent Projects
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Continue where you left off
              </p>
            </div>
          </div>

          {/* Actions */}
          {showActions && prompts.length > 0 && (
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-muted rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                  title="Grid view"
                >
                  <Layers className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                  title="List view"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Clear All</span>
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Grid/List View */}
      <motion.div
        variants={containerVariants}
        className={cn(
          "w-full lg:max-w-7xl mx-auto",
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        )}
      >
        <AnimatePresence mode="popLayout">
          {displayPrompts.map((prompt, index) => {
            const { createdAt, id, title, outlines } = prompt;
            const isHovered = hoveredId === id;
            const isDeleting = deletingId === id;
            const confirmDelete = showDeleteConfirm === id;
            const slideCount = outlines?.length || 0;

            return (
              <motion.div
                key={id}
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
                animate="rest"
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  x: -50,
                  transition: { duration: 0.2 },
                }}
                layout
                onHoverStart={() => setHoveredId(id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <motion.div variants={cardHoverVariants} className="h-full">
                  <Card
                    className={cn(
                      "p-5 flex flex-col h-full border-2 rounded-2xl transition-all duration-300 relative group overflow-hidden",
                      isHovered && "border-primary shadow-xl",
                      isDeleting && "opacity-50 pointer-events-none"
                    )}
                  >
                    {/* Background Gradient */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 0.1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-primary via-primary/50 to-transparent pointer-events-none"
                    />

                    {/* Header */}
                    <div className="flex items-start justify-between mb-3 relative z-10">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base transition-all duration-300",
                          isHovered
                            ? "bg-primary text-primary-foreground shadow-lg scale-110"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </div>

                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Sparkles className="w-3 h-3" />
                        <span
                          className={cn(
                            viewMode === "list" && "hidden xl:inline"
                          )}
                        >
                          AI
                        </span>
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1 mb-4 relative z-10">
                      <h3
                        className={cn(
                          "font-semibold leading-tight group-hover:text-primary transition-colors mb-3",
                          viewMode === "grid"
                            ? "text-xl line-clamp-2"
                            : "text-base line-clamp-2"
                        )}
                      >
                        {title}
                      </h3>

                      {/* Metadata */}
                      <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{timeAgo(createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span>{slideCount} slides</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 relative z-10">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleEdit(id)}
                        className={cn(
                          "flex-1 rounded-xl gap-2 shadow-md",
                          viewMode === "list" && "text-xs px-2"
                        )}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span
                          className={cn(
                            viewMode === "list" && "hidden sm:inline"
                          )}
                        >
                          Continue
                        </span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "rounded-xl",
                              viewMode === "list" && "h-8 w-8 p-0"
                            )}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleEdit(id)}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(id)}
                            className="text-destructive focus:text-destructive"
                          >
                            {confirmDelete ? (
                              <>
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Confirm Delete?
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Shine Effect */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: isHovered ? "100%" : "-100%" }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                    />
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Footer Stats */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4"
      >
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border">
          <span className="font-semibold text-foreground">
            {prompts.length}
          </span>
          <span>{prompts.length === 1 ? "project" : "projects"} saved</span>
        </div>

        {maxDisplay && prompts.length > maxDisplay && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setViewMode("list")}
          >
            <ExternalLink className="h-4 w-4" />
            View All
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RecentPrompts;

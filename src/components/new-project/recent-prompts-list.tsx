"use client";

import { useCallback, useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, FileText, Layers } from "lucide-react";
import { Button } from "../ui/button";
import { showError, showSuccess } from "@/components/toast-message";
import { AIPromptCard } from "./ai-prompt-card";
import DeletePromptAlert from "./delete-prompt-alert";
import { usePromptStore } from "@/store/use-prompt-store";
import { useCreativeAiStore } from "@/store/use-creative-ai-store";
import { cn } from "@/lib/utils";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "@/lib/constants";

const CLOCK_VARIANTS = {
  animate: { rotate: [0, 10, -10, 0] },
};

interface RecentAIPromptsProps {
  onLoadPrompt?: (id: string) => void;
  showActions?: boolean;
  maxDisplay?: number;
}

type DeleteMode = null | "single" | "all";

const RecentPromptsList = ({
  onLoadPrompt,
  showActions = true,
  maxDisplay,
}: RecentAIPromptsProps) => {
  const { prompts, setPage, deletePrompt, clearPrompts } = usePromptStore();
  const { addMultipleOutlines, setCurrentAIPrompt } = useCreativeAiStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteMode, setDeleteMode] = useState<DeleteMode>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayPrompts = useMemo(
    () => (maxDisplay ? prompts.slice(0, maxDisplay) : prompts),
    [prompts, maxDisplay]
  );

  const gridClassName = useMemo(
    () =>
      cn(
        "w-full lg:max-w-7xl mx-auto",
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      ),
    [viewMode]
  );

  const handleEdit = useCallback(
    (id: string) => {
      const prompt = prompts.find((p) => p.id === id);
      if (!prompt) {
        showError("Prompt not found", "This prompt may have been deleted.");
        return;
      }

      const formattedOutlines = prompt.outlines.map((outline: any) => ({
        id: outline.id || crypto.randomUUID(),
        title: outline.title,
        order: outline.order,
      }));

      setPage("creative-ai");
      addMultipleOutlines(formattedOutlines);
      setCurrentAIPrompt(prompt.title);
      showSuccess("Prompt loaded", "Continue editing your presentation");

      onLoadPrompt?.(id);
    },
    [prompts, setPage, addMultipleOutlines, setCurrentAIPrompt, onLoadPrompt]
  );

  const handleDeleteClick = useCallback((id: string) => {
    setPendingDeleteId(id);
    setDeleteMode("single");
  }, []);

  const handleClearAllClick = useCallback(() => {
    setDeleteMode("all");
  }, []);

  const confirmSingleDelete = useCallback(async () => {
    if (!pendingDeleteId) return;

    setIsDeleting(true);
    setDeletingId(pendingDeleteId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    deletePrompt(pendingDeleteId);
    setDeletingId(null);
    setPendingDeleteId(null);
    setIsDeleting(false);
    showSuccess("Prompt deleted", "Removed from your history");
  }, [pendingDeleteId, deletePrompt]);

  const confirmClearAll = useCallback(async () => {
    setIsDeleting(true);
    setDeletingId("*");
    await new Promise((resolve) => setTimeout(resolve, 300));
    clearPrompts();
    setDeletingId(null);
    setIsDeleting(false);
    showSuccess("All prompts cleared", "Your history is now empty");
  }, [clearPrompts]);

  const handleDuplicate = useCallback(
    (id: string) => {
      const prompt = prompts.find((p) => p.id === id);
      if (!prompt) return;

      const formattedOutlines = prompt.outlines.map((outline: any) => ({
        id: outline.id || crypto.randomUUID(),
        title: outline.title,
        order: outline.order,
      }));

      addMultipleOutlines(formattedOutlines);
      setCurrentAIPrompt(`${prompt.title} (Copy)`);
      setPage("creative-ai");
      showSuccess("Prompt duplicated", "Ready to customize");
    },
    [prompts, addMultipleOutlines, setCurrentAIPrompt, setPage]
  );

  if (prompts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/20"
      >
        <motion.div
          variants={CLOCK_VARIANTS}
          animate="animate"
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

  const promptToDelete = pendingDeleteId
    ? prompts.find((p) => p.id === pendingDeleteId)
    : null;

  return (
    <>
      <motion.div
        variants={CONTAINER_VARIANTS}
        className="space-y-6 mt-16 w-full"
      >
        <motion.div variants={ITEM_VARIANTS} className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                variants={CLOCK_VARIANTS}
                animate="animate"
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

            {showActions && prompts.length > 0 && (
              <div className="flex items-center gap-2">
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
                  size="lg"
                  onClick={handleClearAllClick}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Clear All</span>
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={CONTAINER_VARIANTS} className={gridClassName}>
          <AnimatePresence mode="popLayout">
            {displayPrompts.map((prompt, index) => (
              <AIPromptCard
                key={prompt.id}
                prompt={prompt}
                index={index}
                isHovered={hoveredId === prompt.id}
                isDeleting={deletingId === prompt.id}
                confirmDelete={false}
                viewMode={viewMode}
                onHover={() => setHoveredId(prompt.id)}
                onHoverEnd={() => setHoveredId(null)}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onDuplicate={handleDuplicate}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <DeletePromptAlert
        open={deleteMode === "single"}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteMode(null);
            setPendingDeleteId(null);
          }
        }}
        title="Delete Prompt?"
        description={
          promptToDelete ? (
            <>
              Are you sure you want to delete{" "}
              <strong>"{promptToDelete.title}"</strong>? This action cannot be
              undone.
            </>
          ) : (
            "This action cannot be undone."
          )
        }
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={confirmSingleDelete}
        isLoading={isDeleting}
      />

      <DeletePromptAlert
        open={deleteMode === "all"}
        onOpenChange={(open) => {
          if (!open) setDeleteMode(null);
        }}
        title="Delete All Prompts?"
        description={
          <>
            You're about to delete{" "}
            <strong>
              {prompts.length} prompt{prompts.length !== 1 ? "s" : ""}
            </strong>
            . This action cannot be undone.
          </>
        }
        cancelText="Cancel"
        confirmText="Delete All"
        onConfirm={confirmClearAll}
        isLoading={isDeleting}
      />
    </>
  );
};

export default memo(RecentPromptsList);

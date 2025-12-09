"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant: "delete" | "recover";
  onConfirm: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const VARIANT_CONFIG = {
  delete: {
    title: "Delete Project?",
    description:
      "This will move your project to trash. You can recover it later.",
    confirmLabel: "Delete",
    icon: Trash2,
    iconBg: "bg-red-100 dark:bg-red-950",
    iconColor: "text-red-600 dark:text-red-400",
    actionClass:
      "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
    border: "border-red-200 dark:border-red-800",
  },
  recover: {
    title: "Recover Project?",
    description: "This will restore your project and all your data.",
    confirmLabel: "Recover",
    icon: RotateCcw,
    iconBg: "bg-green-100 dark:bg-green-950",
    iconColor: "text-green-600 dark:text-green-400",
    actionClass:
      "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700",
    border: "border-green-200 dark:border-green-800",
  },
} as const;

const ICON_ANIMATION = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: "spring", stiffness: 200, damping: 15 },
} as const;

const DialogIcon = memo(
  ({
    config,
    variant,
  }: {
    config: typeof VARIANT_CONFIG.delete;
    variant: "delete" | "recover";
  }) => {
    const Icon = config.icon;

    return (
      <motion.div {...ICON_ANIMATION} className="mx-auto">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            config.iconBg
          )}
        >
          <div className={config.iconColor}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </motion.div>
    );
  }
);

export const ConfirmDialog = memo(
  ({
    trigger,
    title,
    description,
    confirmLabel,
    cancelLabel = "Cancel",
    isLoading = false,
    variant,
    onConfirm,
    open,
    onOpenChange,
  }: ConfirmDialogProps) => {
    const config = VARIANT_CONFIG[variant] as typeof VARIANT_CONFIG.delete;

    const finalTitle = title || config.title;
    const finalDescription = description || config.description;
    const finalConfirmLabel = confirmLabel || config.confirmLabel;

    const handleConfirm = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isLoading) {
        onConfirm();
      }
    };

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

        <AlertDialogContent className={cn("sm:max-w-md", config.border)}>
          {onOpenChange && (
            <Button
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className={cn(
                "absolute right-4 top-4 rounded-sm opacity-70",
                "transition-opacity hover:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <AlertDialogHeader className="gap-4 pt-2">
            <DialogIcon config={config} variant={variant} />

            <AlertDialogTitle className="text-center text-lg font-semibold">
              {finalTitle}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center text-sm leading-relaxed">
              {finalDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="sm:flex-col-reverse gap-2 sm:gap-2">
            <AlertDialogCancel
              disabled={isLoading}
              className="w-full sm:w-full mt-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {cancelLabel}
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isLoading}
              onClick={handleConfirm}
              className={cn(
                "w-full sm:w-full text-white transition-all",
                "hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                config.actionClass
              )}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </motion.span>
                ) : (
                  <motion.span
                    key="confirm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {finalConfirmLabel}
                  </motion.span>
                )}
              </AnimatePresence>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

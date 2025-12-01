import React from "react";
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
import {
  Loader2,
  AlertTriangle,
  Info,
  Trash2,
  CheckCircle,
  X,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type AlertVariant = "destructive" | "warning" | "info" | "success" | "default";

type Props = {
  children: React.ReactNode;
  title?: string;
  description: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Styling
  variant?: AlertVariant;
  actionLabel?: string;
  cancelLabel?: string;
  actionClassName?: string;
  cancelClassName?: string;

  // Icons
  showIcon?: boolean;
  customIcon?: React.ReactNode;

  // Additional features
  showProgress?: boolean;
  progressValue?: number;
  confirmText?: string;
  dangerZone?: boolean;
  showBadge?: boolean;
  badgeText?: string;
};

const variantConfig = {
  destructive: {
    icon: <Trash2 className="h-5 w-5" />,
    iconBg:
      "bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950 dark:to-red-900",
    iconColor: "text-red-600 dark:text-red-400",
    buttonVariant: "destructive" as const,
    borderColor: "border-red-200 dark:border-red-800",
    accentColor: "bg-red-500",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    iconBg:
      "bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-950 dark:to-yellow-900",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    buttonVariant: "default" as const,
    borderColor: "border-yellow-200 dark:border-yellow-800",
    accentColor: "bg-yellow-500",
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    iconBg:
      "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    buttonVariant: "default" as const,
    borderColor: "border-blue-200 dark:border-blue-800",
    accentColor: "bg-blue-500",
  },
  success: {
    icon: <CheckCircle className="h-5 w-5" />,
    iconBg:
      "bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-green-900",
    iconColor: "text-green-600 dark:text-green-400",
    buttonVariant: "default" as const,
    borderColor: "border-green-200 dark:border-green-800",
    accentColor: "bg-green-500",
  },
  default: {
    icon: <Shield className="h-5 w-5" />,
    iconBg: "bg-gradient-to-br from-primary/10 to-primary/5",
    iconColor: "text-primary",
    buttonVariant: "default" as const,
    borderColor: "border-primary/20",
    accentColor: "bg-primary",
  },
};

const AlertDialogBox = ({
  children,
  title = "Are you absolutely sure?",
  description,
  onOpenChange,
  open,
  loading = false,
  disabled = false,
  onClick,
  variant = "destructive",
  actionLabel = "Continue",
  cancelLabel = "Cancel",
  actionClassName,
  cancelClassName,
  showIcon = true,
  customIcon,
  showProgress = false,
  progressValue = 0,
  confirmText,
  dangerZone = false,
  showBadge = false,
  badgeText,
}: Props) => {
  const config = variantConfig[variant];
  const isDisabled = loading || disabled;

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className={cn("sm:max-w-md", config.borderColor)}>
        {/* Top accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className={cn(
            "absolute top-0 left-0 right-0 h-1 rounded-t-lg",
            config.accentColor
          )}
        />

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          disabled={loading}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <AlertDialogHeader className="gap-4 pt-2">
          {/* Icon with animation */}
          {showIcon && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto"
            >
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full shadow-lg",
                  config.iconBg
                )}
              >
                <motion.div
                  animate={
                    variant === "destructive" || variant === "warning"
                      ? { rotate: [0, -10, 10, -10, 0] }
                      : {}
                  }
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={config.iconColor}
                >
                  {customIcon || config.icon}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Title with badge */}
          <div className="space-y-2">
            <AlertDialogTitle className="text-center text-xl font-bold">
              {title}
            </AlertDialogTitle>

            {showBadge && badgeText && (
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-xs">
                  {badgeText}
                </Badge>
              </div>
            )}
          </div>

          {/* Description */}
          <AlertDialogDescription className="text-center text-sm leading-relaxed text-muted-foreground">
            {description}
          </AlertDialogDescription>

          {/* Confirm text requirement */}
          {confirmText && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-muted p-3 text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">
                Type{" "}
                <strong className="font-mono text-foreground">
                  {confirmText}
                </strong>{" "}
                to confirm
              </p>
            </motion.div>
          )}

          {/* Danger zone warning */}
          {dangerZone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-lg border-2 border-destructive/50 bg-destructive/10 p-3 text-xs"
            >
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-destructive font-medium">
                This action cannot be undone
              </span>
            </motion.div>
          )}

          {/* Progress indicator */}
          {showProgress && loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Processing...</span>
                <span>{progressValue}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  className={cn("h-full", config.accentColor)}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:flex-col-reverse gap-2 sm:gap-2 mt-2">
          {/* Cancel Button */}
          <AlertDialogCancel
            disabled={loading}
            className={cn(
              "w-full sm:w-full mt-0 transition-all",
              "hover:scale-[1.02] active:scale-[0.98]",
              cancelClassName
            )}
          >
            {cancelLabel}
          </AlertDialogCancel>

          {/* Action Button */}
          <AlertDialogAction
            disabled={isDisabled}
            onClick={handleAction}
            className={cn(
              "w-full sm:w-full transition-all",
              "hover:scale-[1.02] active:scale-[0.98]",
              variant === "destructive" &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              actionClassName
            )}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </motion.span>
              ) : (
                <motion.span
                  key="action"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  {actionLabel}
                </motion.span>
              )}
            </AnimatePresence>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogBox;

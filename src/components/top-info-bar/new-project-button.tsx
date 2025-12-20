"use client";

import { useCallback, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UnlockedButton from "./unlocked-button";
import LockedButton from "./locked-button";
import { showError } from "@/components/toast-message";
import { usePromptStore } from "@/store/use-prompt-store";
import { cn } from "@/utils";
import type { User } from "@/generated/prisma/client";

const BUTTON_VARIANTS = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
} as const;

const TRANSITION = { duration: 0.2 } as const;

const NewProjectButton = ({ user }: { user: User }) => {
  const { setPage } = usePromptStore();
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  const hasSubscription = useMemo(
    () => !!user?.subscription,
    [user?.subscription]
  );

  const handleCreateNewProject = useCallback(() => {
    if (!hasSubscription) {
      showError(
        "Premium Required",
        "Upgrade to unlock unlimited presentations, redirecting to subscription"
      );
      return router.push("/subscription");
    }

    setPage("creative-ai");
  }, [hasSubscription, router]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  const tooltipContent = useMemo(() => {
    return hasSubscription ? (
      <div className="flex items-center gap-2 py-1">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Start a new presentation</span>
      </div>
    ) : (
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Premium Feature
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upgrade to create unlimited presentations with AI assistance
          </p>
        </div>
      </div>
    );
  }, [hasSubscription]);

  return (
    <TooltipProvider delayDuration={hasSubscription ? 300 : 200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            variants={BUTTON_VARIANTS}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            transition={TRANSITION}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {hasSubscription ? (
              <UnlockedButton
                isHovering={isHovering}
                onClick={handleCreateNewProject}
              />
            ) : (
              <LockedButton
                isHovering={isHovering}
                onClick={handleCreateNewProject}
              />
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={8}
          className={cn(
            "bg-popover text-popover-foreground border-2 shadow-2xl rounded-lg z-50",
            !hasSubscription && "max-w-xs p-4"
          )}
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NewProjectButton;

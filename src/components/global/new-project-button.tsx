"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma/client";
import { Plus, Lock, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  user: User;
};

const NewProjectButton = ({ user }: Props) => {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  const hasSubscription = user?.subscription;

  const handleCreateNewProject = useCallback(() => {
    if (!hasSubscription) {
      toast.error("Premium Required", {
        description: "Upgrade to unlock unlimited presentations",
        action: {
          label: "View Plans",
          onClick: () => router.push("/pricing"),
        },
        duration: 5000,
      });
      return;
    }

    router.push("/new-project");
  }, [hasSubscription, router]);

  if (!hasSubscription) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Button
                size="lg"
                onClick={handleCreateNewProject}
                variant="outline"
                className={cn(
                  "rounded-xl font-semibold gap-2 relative overflow-hidden group",
                  "border-2 border-dashed border-muted-foreground/30",
                  "hover:border-primary/50 hover:bg-primary/5",
                  "transition-all duration-300"
                )}
                aria-label="Create new project (Premium required)"
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-primary/10"
                  animate={{
                    x: isHovering ? ["-100%", "100%"] : "-100%",
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isHovering ? Infinity : 0,
                    ease: "linear",
                  }}
                />

                <motion.div
                  className="flex items-center gap-2 relative z-10"
                  animate={{
                    x: isHovering ? [0, 2, 0] : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: isHovering ? Infinity : 0,
                    repeatDelay: 0.5,
                  }}
                >
                  <Lock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    New Project
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -top-1 -right-1 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
                >
                  PRO
                </motion.div>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={8}
            className="max-w-xs p-4 bg-popover text-popover-foreground border-2 shadow-2xl rounded-lg z-50"
          >
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
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Button
              size="lg"
              onClick={handleCreateNewProject}
              className={cn(
                "rounded-xl font-semibold gap-2 relative overflow-hidden group",
                "bg-linear-to-r from-primary to-primary/90",
                "hover:from-primary hover:to-primary",
                "text-primary-foreground shadow-lg",
                "transition-all duration-300",
                isHovering && "shadow-xl shadow-primary/40"
              )}
              aria-label="Create a new presentation"
            >
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    exit={{ x: "100%" }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                className="flex items-center gap-2 relative z-10"
                animate={{
                  x: isHovering ? 2 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  animate={{
                    rotate: isHovering ? [0, 90, 0] : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                >
                  <Plus className="h-5 w-5" />
                </motion.div>
                <span>New Project</span>
              </motion.div>

              <AnimatePresence>
                {isHovering && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute pointer-events-none"
                        initial={{
                          x: "50%",
                          y: "50%",
                          scale: 0,
                          opacity: 0,
                        }}
                        animate={{
                          x: `${50 + (i - 1) * 30}%`,
                          y: `${30 - i * 10}%`,
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 0.5,
                        }}
                      >
                        <Sparkles className="h-3 w-3 text-primary-foreground/60" />
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>

              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
                }}
              />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={8}
          className="bg-popover text-popover-foreground border-2 shadow-2xl rounded-lg z-50"
        >
          <div className="flex items-center gap-2 py-1">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Start a new presentation
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NewProjectButton;

"use client";

import React, { useCallback } from "react";
import { SidebarGroupLabel } from "../ui/sidebar";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const QUICK_ACTION_VARIANTS = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
} as const;

const MOTION_TRANSITION = { delay: 0.1 } as const;

export default function QuickAction() {
  const router = useRouter();

  const handleNewProject = useCallback(() => {
    router.push("/new-project");
  }, [router]);

  return (
    <>
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3 group-data-[state=collapsed]:hidden">
        Quick Action
      </SidebarGroupLabel>

      <motion.div
        variants={QUICK_ACTION_VARIANTS}
        initial="hidden"
        animate="visible"
        transition={MOTION_TRANSITION}
        className="mt-2 mb-2 group-data-[state=collapsed]:hidden"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewProject}
          className="w-full justify-center gap-2 font-bold transition-all duration-200
                     hover:translate-x-1 hover:border-primary/50 hover:bg-accent group/btn"
        >
          <Plus className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
          <span className="text-xs font-medium">New Presentation</span>
        </Button>
      </motion.div>
    </>
  );
}

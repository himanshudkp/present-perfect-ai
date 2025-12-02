"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { cn } from "@/utils/utils";

type DashboardHeaderProps = {
  projectCount: number;
  hasProjects: boolean;
};

const ANIM = {
  container: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  },
  hover: { scale: 1.1, rotate: 5 },
  spring: { type: "spring", stiffness: 300 },
} as const;

const DashboardHeader = ({
  projectCount,
  hasProjects,
}: DashboardHeaderProps) => {
  const subtitle = hasProjects
    ? `${projectCount} presentation${projectCount !== 1 ? "s" : ""}`
    : "Start creating your first presentation";

  return (
    <motion.div
      className="space-y-6"
      variants={ANIM.container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <motion.div variants={ANIM.item} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <motion.div whileHover={ANIM.hover} transition={ANIM.spring}>
              <FileText className="h-7 w-7 text-primary" />
            </motion.div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Projects
              </h1>

              <p
                className={cn(
                  "text-sm font-medium transition-colors duration-200 mt-0.5",
                  hasProjects
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
                )}
              >
                {subtitle}
                {hasProjects && (
                  <span className="hidden sm:inline">
                    {" "}
                    • All your work in one place
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default memo(DashboardHeader);

"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
} as const;

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} as const;

const TRANSITION = {
  duration: 3,
  repeat: Infinity,
  ease: "easeInOut",
} as const;

const ANIMATE = {
  FILETEXT_PARENT: { y: [0, -10, 0] },
  FILETEXT_CHILD: { rotate: [0, 5, -5, 0] },
  FILETEXT: { scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] },
  FOOTER: { x: [0, 100, 0], y: [0, -50, 0] },
};

const ProjectNotFound = () => {
  return (
    <motion.div
      className="flex flex-col min-h-[60vh] w-full justify-center items-center gap-8 py-12 relative"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="relative"
        variants={ITEM_VARIANTS}
        animate={ANIMATE.FILETEXT_PARENT}
        transition={TRANSITION}
      >
        <div className="relative h-20 w-20 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
            animate={ANIMATE.FILETEXT}
            transition={TRANSITION}
          />
          <motion.div animate={ANIMATE.FILETEXT_CHILD} transition={TRANSITION}>
            <FileText className="h-10 w-10 text-primary" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col items-center justify-center text-center gap-4"
        variants={ITEM_VARIANTS}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          No Projects Yet
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
          Your presentation library is empty. Create your first project to get
          started with beautiful slides and AI-powered design.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 items-center justify-center"
        variants={ITEM_VARIANTS}
      >
        <Link href="/new-project" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full gap-2 rounded-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            Create Your First Project
          </Button>
        </Link>
        <Link href="/templates" className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="w-full gap-2 rounded-lg font-semibold"
          >
            Browse Templates
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      <motion.div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={ANIMATE.FOOTER}
          transition={TRANSITION}
        />
      </motion.div>
    </motion.div>
  );
};

export default memo(ProjectNotFound);

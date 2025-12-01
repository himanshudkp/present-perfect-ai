"use client";

import { motion } from "framer-motion";
import { FileText, Plus, ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import Link from "next/link";

const ProjectNotFound = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  return (
    <motion.div
      className="flex flex-col min-h-[60vh] w-full justify-center items-center gap-8 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="relative"
        variants={itemVariants}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative h-20 w-20 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FileText className="h-10 w-10 text-primary" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col items-center justify-center text-center gap-4"
        variants={itemVariants}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          No Projects Yet
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
          "Your presentation library is empty. Create your first project to get
          started with beautiful slides and AI-powered design."
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 items-center justify-center"
        variants={itemVariants}
      >
        <Link href="/new-project" className="w-full sm:w-auto">
          <Button
            size="lg"
            className={cn(
              "w-full gap-2 rounded-lg font-semibold",
              "bg-primary hover:bg-primary/90",
              "transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
            )}
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

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
};

export default ProjectNotFound;

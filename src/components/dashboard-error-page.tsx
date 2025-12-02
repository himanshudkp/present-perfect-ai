"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/utils";
import { FileText } from "lucide-react";

const DashboardErrorPage = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          All your work in one place
        </p>
      </div>

      <motion.div
        className={cn(
          "flex flex-col items-center justify-center gap-4 py-12 rounded-lg",
          "border border-destructive/30 bg-destructive/5"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Unable to load projects
          </h2>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            We encountered an error while loading your projects. Please try
            refreshing the page or contact support if the problem persists.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className={cn(
            "px-4 py-2 rounded-lg font-medium text-sm",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "transition-colors duration-200"
          )}
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
};

export default DashboardErrorPage;

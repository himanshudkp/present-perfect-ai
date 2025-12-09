"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import type { TabView } from "@/lib/types";

const ANIM = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
} as const;

interface NoProjectsFoundProps {
  searchQuery: string;
  activeFiltersCount: number;
  activeTab: TabView;
  onClearFilters: () => void;
}

const NoProjectsFound = ({
  searchQuery,
  activeFiltersCount,
  activeTab,
  onClearFilters,
}: NoProjectsFoundProps) => {
  const hasFilters = searchQuery || activeFiltersCount > 0;

  const message = (() => {
    if (hasFilters)
      return "Try adjusting your search terms or filters to find what you're looking for";

    if (activeTab === "favorites")
      return "You haven't favorite any projects yet. Star projects to see them here!";

    if (activeTab === "deleted")
      return "No deleted projects. Deleted items will appear here for recovery.";

    return "Create your first project to get started with presentations";
  })();

  return (
    <motion.div
      initial={ANIM.initial}
      animate={ANIM.animate}
      className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/20"
    >
      <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-xl font-semibold mb-2">No projects found</h3>

      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        {message}
      </p>

      {hasFilters && (
        <Button variant="outline" onClick={onClearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear all filters
        </Button>
      )}
    </motion.div>
  );
};

export default memo(NoProjectsFound);

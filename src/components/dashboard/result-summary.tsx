"use client";

import { memo } from "react";
import type { SortOption, TabView } from "@/types";

const formatSortLabel = (sortBy: SortOption) => sortBy.replace("-", " ");
interface ResultSummaryProps {
  searchQuery: string;
  activeTab: TabView;
  sortBy: SortOption;
  filteredProjectsCount: number;
}

const ResultSummary = ({
  filteredProjectsCount,
  searchQuery,
  activeTab,
  sortBy,
}: ResultSummaryProps) => {
  const projectLabel = filteredProjectsCount === 1 ? "project" : "projects";
  const locationLabel = activeTab !== "all" ? ` in ${activeTab}` : "";
  const foundLabel = searchQuery ? " found" : "";

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        {filteredProjectsCount} {projectLabel}
        {foundLabel}
        {locationLabel}
      </span>
      {filteredProjectsCount > 0 && (
        <span className="text-xs">Sorted by {formatSortLabel(sortBy)}</span>
      )}
    </div>
  );
};

export default memo(ResultSummary);

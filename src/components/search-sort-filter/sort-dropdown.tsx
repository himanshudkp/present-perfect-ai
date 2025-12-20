"use client";

import { memo, useCallback } from "react";
import {
  ArrowUpDown,
  ArrowUpWideNarrow,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { SortOption } from "@/types";

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "recent", label: "Most Recent", icon: Calendar },
  { value: "updated", label: "Recently Updated", icon: TrendingUp },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "slides", label: "Most Slides", icon: ArrowUpWideNarrow },
] as const;

interface SortDropdownProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}

const SortDropdown = ({ sortBy, setSortBy }: SortDropdownProps) => {
  const handleChange = useCallback(
    (v: string) => setSortBy(v as SortOption),
    [setSortBy]
  );

  return (
    <Select value={sortBy} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>

      <SelectContent>
        {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <span className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default memo(SortDropdown);

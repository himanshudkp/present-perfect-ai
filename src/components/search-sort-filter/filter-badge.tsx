"use client";

import { memo } from "react";
import { X } from "lucide-react";
import { Badge } from "../ui/badge";

interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
}

const FilterBadge = ({ label, onRemove }: FilterBadgeProps) => {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter ${label}`}
      className="cursor-pointer"
    >
      <Badge
        variant="secondary"
        className="gap-1 pr-1 pl-2 flex items-center hover:bg-secondary/70 transition-colors"
      >
        {label}
        <X className="h-3 w-3" />
      </Badge>
    </button>
  );
};

export default memo(FilterBadge);

"use client";

import { memo, type ReactNode, useMemo } from "react";
import { Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/utils";
import type { ViewMode } from "@/types";

interface StatusBadgesProps {
  isFavorite?: boolean | null;
  isDeleted?: boolean;
  position?: "grid" | "list";
  viewMode: ViewMode;
}

const StatusBadges = ({
  isFavorite,
  isDeleted,
  position = "grid",
  viewMode,
}: StatusBadgesProps) => {
  const showLabel = viewMode !== "compact";

  const badges = useMemo(
    () =>
      [
        isFavorite && {
          key: "favorite",
          text: showLabel ? "Favorite" : null,
          icon: (
            <Star className="h-3 w-3 fill-current text-yellow-500 shrink-0" />
          ),
          className:
            position === "grid"
              ? "bg-white/90 backdrop-blur-sm text-yellow-600 border-yellow-200"
              : "text-[10px]",
          variant: position === "grid" ? "secondary" : "secondary",
        },
        isDeleted && {
          key: "deleted",
          text: showLabel ? "Deleted" : null,
          icon: <Trash2 className="h-3 w-3 fill-red-500 shrink-0" />,
          className:
            position === "grid"
              ? "text-[10px] px-2 py-0.5 shadow-lg"
              : "text-[10px]",
          variant: position === "grid" ? "destructive" : "secondary",
        },
      ].filter(Boolean) as {
        key: string;
        text: string | null;
        icon: ReactNode;
        className: string;
        variant: "secondary" | "destructive";
      }[],
    [isFavorite, isDeleted, position, showLabel]
  );

  if (position === "list") {
    return (
      <div className="flex items-center gap-1 shrink-0">
        {badges.map(({ key, text, icon, className }) => (
          <Badge
            key={key}
            variant="secondary"
            className={cn("py-0.5 px-2 text-[10px] gap-1", className)}
          >
            {icon}
            {text}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute top-2 right-2 flex flex-col gap-1">
      {badges.map(({ key, text, icon, className, variant }) => (
        <Badge
          key={key}
          variant={variant}
          className={cn("px-2 py-0.5 text-[10px] gap-1 shadow-lg", className)}
        >
          {icon}
          {text}
        </Badge>
      ))}
    </div>
  );
};

export default memo(StatusBadges);

"use client";

import { memo } from "react";
import { ActionItem } from "./action-item";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { Action, ActionCategory } from "@/lib/types";

interface CategorySectionProps {
  category: ActionCategory;
  actions: Action[];
  filteredActions: Action[];
  selectedIndex: number;
  onAction: (action: Action) => void;
  onSelectIndex: (index: number) => void;
}

export const CategorySection = memo(
  ({
    category,
    actions,
    filteredActions,
    selectedIndex,
    onAction,
    onSelectIndex,
  }: CategorySectionProps) => {
    if (Array.isArray(actions) && !actions.length) return null;

    return (
      <div>
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {CATEGORY_LABELS[category]}
        </div>
        <div className="space-y-1">
          {Array.isArray(actions) &&
            actions.map((action) => {
              const globalIndex = filteredActions.indexOf(action);
              const isSelected = globalIndex === selectedIndex;

              return (
                <ActionItem
                  key={action.id}
                  action={action}
                  isSelected={isSelected}
                  onClick={() => onAction(action)}
                  onMouseEnter={() => onSelectIndex(globalIndex)}
                />
              );
            })}
        </div>
      </div>
    );
  }
);

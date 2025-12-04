"use client";

import { useMemo } from "react";
import type { Action, ActionCategory } from "@/types";

export const useFilteredActions = (actions: Action[], search: string) => {
  const filteredActions = useMemo(() => {
    if (!search) return actions;

    const searchLower = search.toLowerCase();
    return actions.filter(
      (action) =>
        action.title.toLowerCase().includes(searchLower) ||
        action.description?.toLowerCase().includes(searchLower) ||
        action.keywords.some((keyword) => keyword.includes(searchLower))
    );
  }, [actions, search]);

  const groupedActions = useMemo(() => {
    return filteredActions.reduce((acc, action) => {
      if (!acc[action.category]) {
        acc[action.category] = [];
      }
      acc[action.category].push(action);
      return acc;
    }, {} as Record<ActionCategory, Action[]>);
  }, [filteredActions]);

  return { filteredActions, groupedActions };
};

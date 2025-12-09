"use client";

import { memo, useMemo } from "react";
import { Inbox, Star, X, Zap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import type { TabView } from "@/lib/types";

const TAB_CONFIG = [
  { value: "all", icon: Inbox, label: "All" },
  { value: "active", icon: Zap, label: "Active" },
  { value: "favorites", icon: Star, label: "Favorites" },
  { value: "deleted", icon: X, label: "Trash" },
] as const;

interface FilterTabsProps {
  activeTab: TabView;
  setActiveTab: (value: React.SetStateAction<TabView>) => void;
  projectCounts: {
    all: number;
    active: number;
    deleted: number;
    favorites: number;
    sellable: number;
  };
}

const FilterTabs = ({
  activeTab,
  setActiveTab,
  projectCounts,
}: FilterTabsProps) => {
  const countMap = useMemo(
    () => ({
      all: projectCounts.all,
      active: projectCounts.active,
      favorites: projectCounts.favorites,
      deleted: projectCounts.deleted,
    }),
    [projectCounts]
  );

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabView)}>
      <TabsList className="grid w-full grid-cols-4 lg:w-auto">
        {TAB_CONFIG.map(({ value, icon: Icon, label }) => (
          <TabsTrigger key={value} value={value} className="gap-2">
            <Icon className="h-4 w-4" />
            <span>{label}</span>

            <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
              {countMap[value]}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default memo(FilterTabs);

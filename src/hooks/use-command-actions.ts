"use client";

import { Action } from "@/types";
import {
  Brain,
  Clock,
  FileText,
  Folder,
  Home,
  LayoutTemplate,
  Plus,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export const useCommandActions = () => {
  const router = useRouter();

  return useMemo<Action[]>(
    () => [
      {
        id: "home",
        title: "Go to Home",
        description: "Navigate to dashboard",
        icon: Home,
        action: () => router.push("/dashboard"),
        category: "navigation",
        keywords: ["home", "dashboard", "main"],
        shortcut: "H",
      },
      {
        id: "projects",
        title: "View All Projects",
        description: "See all your presentations",
        icon: Folder,
        action: () => router.push("/dashboard"),
        category: "navigation",
        keywords: ["projects", "presentations", "all"],
        shortcut: "P",
      },
      {
        id: "recent",
        title: "Recent Projects",
        description: "View recently edited",
        icon: Clock,
        action: () => router.push("/dashboard?filter=recent"),
        category: "navigation",
        keywords: ["recent", "history", "last"],
      },
      {
        id: "favorites",
        title: "Starred Projects",
        description: "View your favorites",
        icon: Star,
        action: () => router.push("/dashboard?filter=starred"),
        category: "navigation",
        keywords: ["starred", "favorites", "bookmarks"],
      },
      {
        id: "new-project",
        title: "New Project",
        description: "Start creating a presentation",
        icon: Plus,
        action: () => router.push("/new-project"),
        category: "create",
        keywords: ["new", "create", "start", "presentation"],
        shortcut: "N",
      },
      {
        id: "ai-generate",
        title: "Generate with AI",
        description: "Use AI to create slides",
        icon: Brain,
        action: () => router.push("/new-project?mode=ai"),
        category: "create",
        keywords: ["ai", "generate", "creative", "automatic"],
        shortcut: "A",
      },
      {
        id: "manual-create",
        title: "Create Manually",
        description: "Build from scratch",
        icon: FileText,
        action: () => router.push("/new-project?mode=manual"),
        category: "create",
        keywords: ["manual", "scratch", "custom"],
        shortcut: "M",
      },
      {
        id: "templates",
        title: "Browse Templates",
        description: "Start from a template",
        icon: LayoutTemplate,
        action: () => router.push("/templates"),
        category: "create",
        keywords: ["template", "theme", "design"],
        shortcut: "T",
      },
      {
        id: "settings",
        title: "Settings",
        description: "Manage your preferences",
        icon: Settings,
        action: () => router.push("/settings"),
        category: "settings",
        keywords: ["settings", "preferences", "config"],
      },
    ],
    [router]
  );
};

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  FileText,
  Sparkles,
  Settings,
  User,
  LogOut,
  Home,
  Folder,
  Clock,
  Star,
  Palette,
  Zap,
  Command,
  ArrowRight,
  Keyboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Action = {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: "navigation" | "create" | "search" | "settings" | "account";
  keywords: string[];
  shortcut?: string;
};

type Props = {
  onNavigate?: (path: string) => void;
};

const CommandPalette = ({ onNavigate }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Define all available actions
  const actions: Action[] = [
    // Navigation
    {
      id: "home",
      title: "Go to Home",
      description: "Navigate to dashboard",
      icon: <Home className="w-4 h-4" />,
      action: () => router.push("/"),
      category: "navigation",
      keywords: ["home", "dashboard", "main"],
      shortcut: "H",
    },
    {
      id: "projects",
      title: "View All Projects",
      description: "See all your presentations",
      icon: <Folder className="w-4 h-4" />,
      action: () => router.push("/projects"),
      category: "navigation",
      keywords: ["projects", "presentations", "all"],
      shortcut: "P",
    },
    {
      id: "recent",
      title: "Recent Projects",
      description: "View recently edited",
      icon: <Clock className="w-4 h-4" />,
      action: () => router.push("/projects?filter=recent"),
      category: "navigation",
      keywords: ["recent", "history", "last"],
    },
    {
      id: "favorites",
      title: "Starred Projects",
      description: "View your favorites",
      icon: <Star className="w-4 h-4" />,
      action: () => router.push("/projects?filter=starred"),
      category: "navigation",
      keywords: ["starred", "favorites", "bookmarks"],
    },

    // Create Actions
    {
      id: "new-project",
      title: "New Project",
      description: "Start creating a presentation",
      icon: <Plus className="w-4 h-4" />,
      action: () => router.push("/new-project"),
      category: "create",
      keywords: ["new", "create", "start", "presentation"],
      shortcut: "N",
    },
    {
      id: "ai-generate",
      title: "Generate with AI",
      description: "Use AI to create slides",
      icon: <Sparkles className="w-4 h-4" />,
      action: () => router.push("/new-project?mode=ai"),
      category: "create",
      keywords: ["ai", "generate", "creative", "automatic"],
      shortcut: "A",
    },
    {
      id: "manual-create",
      title: "Create Manually",
      description: "Build from scratch",
      icon: <FileText className="w-4 h-4" />,
      action: () => router.push("/new-project?mode=manual"),
      category: "create",
      keywords: ["manual", "scratch", "custom"],
      shortcut: "M",
    },
    {
      id: "templates",
      title: "Browse Templates",
      description: "Start from a template",
      icon: <Palette className="w-4 h-4" />,
      action: () => router.push("/templates"),
      category: "create",
      keywords: ["template", "theme", "design"],
      shortcut: "T",
    },

    // Settings
    {
      id: "settings",
      title: "Settings",
      description: "Manage your preferences",
      icon: <Settings className="w-4 h-4" />,
      action: () => router.push("/settings"),
      category: "settings",
      keywords: ["settings", "preferences", "config"],
    },
    {
      id: "profile",
      title: "Your Profile",
      description: "View and edit profile",
      icon: <User className="w-4 h-4" />,
      action: () => router.push("/profile"),
      category: "account",
      keywords: ["profile", "account", "user"],
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      description: "View all shortcuts",
      icon: <Keyboard className="w-4 h-4" />,
      action: () => {
        // Show shortcuts modal
      },
      category: "settings",
      keywords: ["shortcuts", "keyboard", "hotkeys"],
      shortcut: "?",
    },
  ];

  // Filter actions based on search
  const filteredActions = actions.filter((action) => {
    const searchLower = search.toLowerCase();
    return (
      action.title.toLowerCase().includes(searchLower) ||
      action.description?.toLowerCase().includes(searchLower) ||
      action.keywords.some((keyword) => keyword.includes(searchLower))
    );
  });

  // Group filtered actions by category
  const groupedActions = filteredActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, Action[]>);

  // Handle keyboard shortcuts to open/close
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      // Handle ESC
      if (e.key === "Escape") {
        setOpen(false);
      }

      // Handle arrow navigation when open
      if (open) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % filteredActions.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((i) =>
            i === 0 ? filteredActions.length - 1 : i - 1
          );
        }
        if (e.key === "Enter") {
          e.preventDefault();
          const selected = filteredActions[selectedIndex];
          if (selected) {
            handleAction(selected);
          }
        }
      }

      // Handle individual shortcuts
      if (!open && (e.metaKey || e.ctrlKey)) {
        const action = actions.find((a) => a.shortcut === e.key.toUpperCase());
        if (action) {
          e.preventDefault();
          action.action();
          onNavigate?.(action.id);
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, filteredActions, selectedIndex]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [open]);

  const handleAction = useCallback(
    (action: Action) => {
      action.action();
      setOpen(false);
      onNavigate?.(action.id);
    },
    [onNavigate]
  );

  const categoryLabels: Record<string, string> = {
    navigation: "Navigation",
    create: "Create New",
    search: "Search",
    settings: "Settings",
    account: "Account",
  };

  const categoryOrder = [
    "create",
    "navigation",
    "settings",
    "account",
    "search",
  ];

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "relative w-full max-w-sm gap-2 justify-start text-sm text-muted-foreground",
          "h-10 px-4 rounded-lg border border-border",
          "hover:border-primary/50 hover:bg-accent transition-all"
        )}
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Quick actions...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Command Palette Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="sr-only">Quick Actions</DialogTitle>
            <div className="flex items-center gap-2">
              <Command className="w-5 h-5 text-primary" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-8 text-base"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearch("")}
                  className="h-6 w-6 p-0"
                >
                  <span className="sr-only">Clear</span>×
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredActions.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No results found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryOrder.map((category) => {
                  const categoryActions = groupedActions[category];
                  if (!categoryActions || categoryActions.length === 0)
                    return null;

                  return (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {categoryLabels[category]}
                      </div>
                      <div className="space-y-1">
                        {categoryActions.map((action, idx) => {
                          const globalIndex = filteredActions.indexOf(action);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <motion.button
                              key={action.id}
                              onClick={() => handleAction(action)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                                "hover:bg-accent",
                                isSelected && "bg-accent"
                              )}
                              whileHover={{ x: 2 }}
                              transition={{ duration: 0.15 }}
                            >
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {action.icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {action.title}
                                </div>
                                {action.description && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {action.description}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {action.shortcut && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs font-mono"
                                  >
                                    ⌘{action.shortcut}
                                  </Badge>
                                )}
                                {isSelected && (
                                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">
                  ↓
                </kbd>
                <span className="ml-1">Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">
                  ↵
                </kbd>
                <span className="ml-1">Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">
                  Esc
                </kbd>
                <span className="ml-1">Close</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Quick Actions</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommandPalette;

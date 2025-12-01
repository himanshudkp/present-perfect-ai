"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCommandActions } from "@/hooks/use-command-actions";
import { useFilteredActions } from "@/hooks/use-filtered-actions";
import { useInputFocus } from "@/hooks/use-input-focus";
import { Action } from "@/types";
import { useKeyboardNavigation } from "@/hooks/use--keyboard-navigation";
import { useGlobalShortcuts } from "@/hooks/use-global-shortcuts";
import { EmptySearchResult } from "./empty-search";
import { CATEGORY_ORDER } from "@/constants";
import { CategorySection } from "./category-section";
import { CommandFooter } from "./command-footer";

const CommandPalette = ({
  onNavigate,
}: {
  onNavigate?: (path: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const actions = useCommandActions();
  const { filteredActions, groupedActions } = useFilteredActions(
    actions,
    search
  );
  const inputRef = useInputFocus(open);

  const handleAction = useCallback(
    (action: Action) => {
      action.action();
      setOpen(false);
      onNavigate?.(action.id);
    },
    [onNavigate]
  );

  const { selectedIndex, setSelectedIndex } = useKeyboardNavigation(
    open,
    filteredActions,
    handleAction
  );

  useGlobalShortcuts(open, setOpen, actions, onNavigate);

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const handleClearSearch = useCallback(() => {
    setSearch("");
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative w-full max-w-sm gap-2 justify-start text-sm text-muted-foreground h-10 px-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-all"
        aria-label="Open command palette"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Quick actions...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

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
                aria-label="Search commands"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="h-6 w-6 p-0"
                  aria-label="Clear search"
                >
                  ×
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredActions.length === 0 ? (
              <EmptySearchResult />
            ) : (
              <div className="space-y-4">
                {CATEGORY_ORDER.map((category) => (
                  <CategorySection
                    key={category}
                    category={category}
                    actions={groupedActions[category]}
                    filteredActions={filteredActions}
                    selectedIndex={selectedIndex}
                    onAction={handleAction}
                    onSelectIndex={setSelectedIndex}
                  />
                ))}
              </div>
            )}
          </div>

          <CommandFooter />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(CommandPalette);

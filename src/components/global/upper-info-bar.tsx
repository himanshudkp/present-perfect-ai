"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@/generated/prisma/client";
import React, { useCallback, useState } from "react";
import SearchBar from "./search-bar";
import ThemeSwitcher from "./theme-switcher";
import {
  Upload,
  Bell,
  Settings,
  HelpCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import NewProjectButton from "./new-project-button";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  user: User;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  onHelpClick?: () => void;
  showUserMenu?: boolean;
};

const UpperInfoBar = ({
  user,
  notificationCount = 0,
  onNotificationsClick,
  onHelpClick,
  showUserMenu = true,
}: Props) => {
  const [isImporting, setIsImporting] = useState(false);
  const [showSearchFocus, setShowSearchFocus] = useState(false);

  const handleImport = useCallback(async () => {
    setIsImporting(true);
    try {
      // Create file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pptx,.ppt,.pdf,.key";
      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // TODO: Implement actual import logic
          console.log("Importing file:", file.name, file.text());
          console.log("ile Data:", file.text());

          showSuccess(
            "Import started",
            `Processing ${file.name}... This may take a moment.`
          );
          // Simulate import
          setTimeout(() => {
            showSuccess(
              "Import successful",
              "Your presentation has been imported"
            );
          }, 2000);
        }
      };
      input.click();
    } catch (error) {
      console.error("Import failed:", error);
      showError("Import failed", "Please try again");
    } finally {
      setIsImporting(false);
    }
  }, []);

  const getUserInitials = (user: User) => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex shrink-0 flex-wrap items-center gap-2",
        "border-b border-border bg-background/95 backdrop-blur-md p-3 sm:p-4",
        "justify-between transition-all duration-200 shadow-sm"
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger
                className={cn(
                  "transition-all duration-200 hover:bg-muted",
                  "hover:scale-105 active:scale-95"
                )}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Toggle sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator className="h-6" orientation="vertical" />
      </div>

      {/* Center Section - Search */}
      <motion.div
        className="flex-1 max-w-xl mx-2 sm:mx-4"
        animate={{
          scale: showSearchFocus ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <SearchBar />
      </motion.div>

      {/* Right Section */}
      <div className="flex items-center gap-1.5 sm:gap-5 ml-auto flex-wrap justify-end">
        {/* Notifications */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNotificationsClick}
                className={cn(
                  "relative h-9 w-9 p-0",
                  "hover:bg-muted transition-all duration-200",
                  notificationCount > 0 && "hover:scale-105"
                )}
              >
                <Bell className="h-4 w-4" />
                <AnimatePresence>
                  {notificationCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
                      >
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                {notificationCount > 0
                  ? `${notificationCount} new notification${
                      notificationCount > 1 ? "s" : ""
                    }`
                  : "No notifications"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Help */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onHelpClick}
                className="h-9 w-9 p-0 hover:bg-muted transition-all duration-200"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Help & Documentation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Import Button (Mobile) */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={handleImport}
                disabled={isImporting}
                className={cn(
                  "gap-2 font-medium transition-all duration-200",
                  "hover:bg-primary/10 hover:border-primary/50",
                  "h-9"
                )}
              >
                {isImporting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Upload className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Import</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Import presentation (.pptx, .pdf, .key)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* New Project Button */}
        <NewProjectButton user={user} />

        {/* User Menu */}
        {showUserMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "relative h-9 w-9 rounded-full p-0",
                  "hover:ring-2 hover:ring-primary/20 transition-all duration-200"
                )}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.profileImage || undefined}
                    alt={user.name || ""}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.profileImage || undefined}
                      alt={user.name || ""}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="gap-2">
                <FileText className="h-4 w-4" />
                <span>My Projects</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Templates</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  New
                </Badge>
              </DropdownMenuItem>

              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-600 focus:text-red-600 gap-2">
                <span>Sign Out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default UpperInfoBar;

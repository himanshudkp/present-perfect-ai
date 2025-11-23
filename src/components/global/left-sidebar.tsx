"use client";

import { Project, User } from "@/generated/prisma/client";
import React, { useState, useMemo } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavigationContainer from "./nav-container";
import { DATA } from "@/lib/constants";
import NavFooter from "./nav-footer";
import RecentProjects from "./recent-projects";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Star,
  Plus,
  ChevronRight,
  FileText,
  Rocket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

type AppSidebarProps = {
  recentProjects: Project[];
  user: User;
  projectCount?: number;
  favoriteCount?: number;
  showStats?: boolean;
  showQuickCreate?: boolean;
  showProTip?: boolean;
} & React.ComponentProps<typeof Sidebar>;

const AppSidebar = ({
  recentProjects,
  user,
  projectCount = 0,
  favoriteCount = 0,
  showStats = true,
  showQuickCreate = true,
  showProTip = true,
  ...props
}: AppSidebarProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showTip, setShowTip] = useState(true);

  // Calculate user stats
  const userStats = useMemo(() => {
    const recentCount = recentProjects.length;
    const completionRate =
      projectCount > 0 ? (recentCount / projectCount) * 100 : 0;

    return {
      total: projectCount,
      recent: recentCount,
      favorites: favoriteCount,
      completion: Math.min(completionRate, 100),
    };
  }, [recentProjects, projectCount, favoriteCount]);

  // Get user level based on project count
  const getUserLevel = (count: number) => {
    if (count >= 50)
      return { level: "Expert", icon: Rocket, color: "text-purple-500" };
    if (count >= 25)
      return { level: "Advanced", icon: TrendingUp, color: "text-blue-500" };
    if (count >= 10)
      return { level: "Intermediate", icon: Zap, color: "text-yellow-500" };
    return { level: "Beginner", icon: Sparkles, color: "text-green-500" };
  };

  const userLevel = getUserLevel(projectCount);

  const quickActions = [
    {
      label: "New Presentation",
      icon: Plus,
      action: () => router.push("/create"),
      color: "bg-primary hover:bg-primary/90",
    },
    {
      label: "Templates",
      icon: Sparkles,
      action: () => router.push("/templates"),
      color: "bg-secondary hover:bg-secondary/90",
    },
  ];

  const proTips = [
    "💡 Press Ctrl+K for quick actions",
    "🎨 Try our new themes in settings",
    "⚡ Drag slides to reorder them",
    "🌟 Star your favorite projects",
    "📊 View analytics in dashboard",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  React.useEffect(() => {
    if (showProTip) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % proTips.length);
      }, 10000); // Change tip every 10 seconds

      return () => clearInterval(interval);
    }
  }, [showProTip, proTips.length]);

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "max-w-[280px] border-r transition-all duration-300",
        "bg-gradient-to-b from-background to-background/95"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Header */}
      <SidebarHeader className="pt-6 px-3 pb-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <SidebarMenuButton
            size="lg"
            className={cn(
              "data-[state=open]:text-sidebar-accent-foreground",
              "hover:bg-accent/50 transition-all duration-200",
              "group"
            )}
          >
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-primary to-primary/70 group-hover:shadow-lg transition-shadow">
              <Avatar className="h-full w-full rounded-lg">
                <AvatarImage src="/logo.png" alt="PresentPerfect Logo" />
                <AvatarFallback className="rounded-lg bg-transparent text-primary-foreground font-bold">
                  PP
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col items-start">
              <span className="truncate text-primary text-xl font-bold">
                PresentPerfect
              </span>
              <span className="text-[10px] text-muted-foreground">
                AI-Powered Presentations
              </span>
            </div>
          </SidebarMenuButton>
        </motion.div>

        {/* User Level Badge */}
        {showStats && projectCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 px-3"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <userLevel.icon className={cn("h-4 w-4", userLevel.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  {userLevel.level} Creator
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {projectCount} project{projectCount !== 1 ? "s" : ""}
                </p>
              </div>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Lv {Math.floor(projectCount / 5) + 1}
              </Badge>
            </div>
          </motion.div>
        )}
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2 gap-y-2">
        {/* Quick Create Actions */}
        {showQuickCreate && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3 group-data-[state=collapsed]:justify-center">
              <span className="group-data-[state=collapsed]:hidden">
                Quick Create
              </span>
              <Plus className="h-4 w-4 hidden group-data-[state=collapsed]:block" />
            </SidebarGroupLabel>

            <div
              className={cn(
                "gap-2 mt-2",
                "group-data-[state=expanded]:grid group-data-[state=expanded]:grid-cols-1 group-data-[state=expanded]:px-2",
                "group-data-[state=collapsed]:flex group-data-[state=collapsed]:flex-col group-data-[state=collapsed]:px-1"
              )}
            >
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Collapsed View - Icon Only with Tooltip */}
                  <div className="group-data-[state=collapsed]:block group-data-[state=expanded]:hidden">
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={action.action}
                            className={cn(
                              "w-full h-10 p-0 justify-center",
                              "hover:bg-accent hover:scale-105 transition-all duration-200"
                            )}
                            aria-label={action.label}
                          >
                            <action.icon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {action.label}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Expanded View - Full Button */}
                  <div className="group-data-[state=collapsed]:hidden group-data-[state=expanded]:block">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className={cn(
                        "w-full justify-start gap-2 group/btn",
                        "hover:translate-x-1 hover:border-primary/50 hover:bg-accent",
                        "transition-all duration-200"
                      )}
                    >
                      <action.icon className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                      <span className="text-xs font-medium">
                        {action.label}
                      </span>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </SidebarGroup>
        )}

        <SidebarSeparator className="my-3" />

        {/* Main Navigation */}
        <NavigationContainer items={DATA.navigation} />

        <SidebarSeparator className="my-3" />

        {/* Stats Overview */}
        {showStats && projectCount > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3 flex items-center justify-between">
              <span>Overview</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <TrendingUp className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Your activity stats</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarGroupLabel>

            <div className="space-y-3 px-3 mt-2">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground mb-1" />
                  <p className="text-xs font-bold text-foreground">
                    {userStats.total}
                  </p>
                  <p className="text-[9px] text-muted-foreground">Total</p>
                </div>

                <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Clock className="h-3.5 w-3.5 text-blue-500 mb-1" />
                  <p className="text-xs font-bold text-foreground">
                    {userStats.recent}
                  </p>
                  <p className="text-[9px] text-muted-foreground">Recent</p>
                </div>

                <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Star className="h-3.5 w-3.5 text-yellow-500 mb-1" />
                  <p className="text-xs font-bold text-foreground">
                    {userStats.favorites}
                  </p>
                  <p className="text-[9px] text-muted-foreground">Saved</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">
                    Activity Rate
                  </p>
                  <p className="text-[10px] font-semibold text-primary">
                    {Math.round(userStats.completion)}%
                  </p>
                </div>
                <Progress value={userStats.completion} className="h-1.5" />
              </div>
            </div>
          </SidebarGroup>
        )}

        <SidebarSeparator className="my-3" />

        {/* Recent Projects */}
        <RecentProjects recentProjects={recentProjects} />

        {/* Pro Tip */}
        {showProTip && showTip && (
          <SidebarGroup className="mt-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTipIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mx-2 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 relative group"
              >
                <button
                  onClick={() => setShowTip(false)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-background/50 rounded"
                >
                  <span className="text-[10px]">✕</span>
                </button>

                <div className="flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-foreground mb-1">
                      Pro Tip
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {proTips[currentTipIndex]}
                    </p>
                  </div>
                </div>

                {/* Tip indicator dots */}
                <div className="flex items-center justify-center gap-1 mt-2">
                  {proTips.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-1 w-1 rounded-full transition-all duration-300",
                        index === currentTipIndex
                          ? "bg-primary w-3"
                          : "bg-primary/30"
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t">
        <NavFooter dbUser={user} />

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
          className="px-4 py-2 text-center"
        >
          <p className="text-[9px] text-muted-foreground">
            Version 1.0.0 • Made with ❤️
          </p>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

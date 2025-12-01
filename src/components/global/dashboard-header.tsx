"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Award,
  BarChart3,
  Activity,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

type DashboardHeaderProps = {
  projectCount: number;
  hasProjects: boolean;
  activeCount?: number;
  deletedCount?: number;
  favoriteCount?: number;
  recentActivityCount?: number;
  showStats?: boolean;
  showCreateButton?: boolean;
  onCreateNew?: () => void;
  userName?: string;
  greeting?: string;
};

const DashboardHeader = ({
  projectCount,
  hasProjects,
  activeCount,
  deletedCount,
  favoriteCount,
  recentActivityCount = 0,
  showStats = true,
  showCreateButton = true,
  onCreateNew,
  userName,
  greeting,
}: DashboardHeaderProps) => {
  const router = useRouter();

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      router.push("/create");
    }
  };

  const stats = [
    {
      label: "Active",
      value: activeCount ?? projectCount,
      icon: Zap,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      show: true,
    },
    {
      label: "Favorites",
      value: favoriteCount ?? 0,
      icon: Star,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      show: favoriteCount !== undefined && favoriteCount > 0,
    },
    {
      label: "Trash",
      value: deletedCount ?? 0,
      icon: FileText,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      show: deletedCount !== undefined && deletedCount > 0,
    },
    {
      label: "Recent",
      value: recentActivityCount,
      icon: Activity,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      show: recentActivityCount > 0,
    },
  ];

  const getGreetingMessage = () => {
    if (greeting) return greeting;

    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Left Section */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          {/* Greeting */}
          {userName && (
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {getGreetingMessage()}
                </p>
                <h2 className="text-xl font-bold text-foreground">
                  {userName}
                </h2>
              </div>
            </div>
          )}

          {/* Title and Description */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FileText className="h-7 w-7 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                Projects
              </h1>
              <p
                className={cn(
                  "text-sm font-medium transition-colors duration-200 mt-0.5",
                  hasProjects
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
                )}
              >
                {hasProjects ? (
                  <>
                    {projectCount} presentation{projectCount !== 1 ? "s" : ""}{" "}
                    <span className="hidden sm:inline">
                      • All your work in one place
                    </span>
                  </>
                ) : (
                  "Start creating your first presentation"
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Actions */}
        {showCreateButton && (
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            {hasProjects && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Analytics</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View project analytics</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* <Button
              onClick={handleCreateNew}
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Button> */}
          </motion.div>
        )}
      </div>

      {/* Quick Actions / Recent Activity */}
      {hasProjects && recentActivityCount > 0 && (
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted/50 border border-border"
        >
          <TrendingUp className="h-4 w-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {recentActivityCount} project
              {recentActivityCount !== 1 ? "s" : ""}
            </span>{" "}
            updated in the last 7 days
          </p>
        </motion.div>
      )}

      {/* Divider */}
      <motion.div
        variants={itemVariants}
        className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </motion.div>
  );
};

export default DashboardHeader;

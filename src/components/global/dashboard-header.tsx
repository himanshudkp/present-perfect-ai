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
import { cn } from "@/lib/utils";
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
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
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
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
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

          {/* Milestone Badge */}
          {hasProjects && projectCount >= 10 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground">
                {projectCount >= 50
                  ? "🎉 Power User!"
                  : projectCount >= 25
                  ? "🌟 Expert Creator"
                  : "✨ Getting Started"}
              </span>
            </motion.div>
          )}
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

            <Button
              onClick={handleCreateNew}
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Stats Section */}
      {hasProjects && showStats && (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <AnimatePresence>
            {stats.map(
              (stat, index) =>
                stat.show && (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={cn(
                      "relative overflow-hidden rounded-xl border p-4",
                      "transition-all duration-200 cursor-pointer",
                      stat.bgColor,
                      stat.borderColor,
                      "hover:shadow-md"
                    )}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative space-y-2">
                      <div className="flex items-center justify-between">
                        <stat.icon className={cn("h-5 w-5", stat.color)} />
                        {stat.label === "Active" && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className={cn("h-2 w-2 rounded-full", stat.color)}
                          />
                        )}
                      </div>

                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </motion.div>
      )}

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

      {/* Empty State Hint */}
      {!hasProjects && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20"
        >
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h3 className="font-semibold text-foreground">
              Ready to create something amazing?
            </h3>
            <p className="text-sm text-muted-foreground">
              Click "New Project" to start building your first presentation with
              AI or from scratch
            </p>
          </div>
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

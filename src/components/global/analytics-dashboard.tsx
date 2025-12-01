"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Layers,
  Calendar,
  Clock,
  Star,
  Activity,
  PieChart,
  Download,
  Share2,
  Sparkles,
  Eye,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils";
import type { Project, User } from "@/generated/prisma/client";
import {
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface Props {
  projects: Project[];
  user: User;
}

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

const AnalyticsDashboard = ({ projects, user }: Props) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">(
    "30d"
  );

  // Calculate analytics
  const analytics = useMemo(() => {
    // Handle empty projects array
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        deletedProjects: 0,
        favoriteProjects: 0,
        totalSlides: 0,
        avgSlidesPerProject: 0,
        themeChartData: [],
        activityChartData: [],
        slidesChartData: [],
        statusData: [
          { name: "Active", value: 0, color: "#10b981" },
          { name: "Deleted", value: 0, color: "#ef4444" },
          { name: "Favorites", value: 0, color: "#f59e0b" },
        ],
        recentProjects: [],
        newProjects: 0,
        growth: 0,
      };
    }

    const now = new Date();
    const cutoffDate = {
      "7d": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      "30d": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      "90d": new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      all: new Date(0),
    }[timeRange];

    const filteredProjects = projects.filter(
      (p) => new Date(p.createdAt) >= cutoffDate
    );

    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => !p.isDeleted).length;
    const deletedProjects = projects.filter((p) => p.isDeleted).length;
    // const favoriteProjects = projects.filter((p) => p.isFavorite).length;

    const totalSlides = projects.reduce((acc, p) => {
      const slides = Array.isArray(p.slides) ? p.slides.length : 1;
      return acc + slides;
    }, 0);

    const avgSlidesPerProject =
      totalProjects > 0 ? Math.round(totalSlides / totalProjects) : 0;

    // Theme distribution for pie chart
    const themeDistribution = projects.reduce((acc, p) => {
      const theme = p.theme || "Default";
      acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const themeChartData = Object.entries(themeDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    // Activity over time for line chart
    const activityData: Record<string, number> = {};
    const months = timeRange === "all" ? 12 : timeRange === "90d" ? 3 : 1;

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const key = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      activityData[key] = 0;
    }

    projects.forEach((p) => {
      const date = new Date(p.createdAt);
      if (date >= cutoffDate) {
        const key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
        if (activityData.hasOwnProperty(key)) {
          activityData[key]++;
        }
      }
    });

    const activityChartData = Object.entries(activityData).map(
      ([month, projects]) => ({
        month,
        projects,
      })
    );

    // Slides distribution for bar chart
    const slidesDistribution: Record<string, number> = {
      "1-5": 0,
      "6-10": 0,
      "11-20": 0,
      "21-30": 0,
      "30+": 0,
    };

    projects.forEach((p) => {
      const slideCount = Array.isArray(p.slides) ? p.slides.length : 1;
      if (slideCount <= 5) slidesDistribution["1-5"]++;
      else if (slideCount <= 10) slidesDistribution["6-10"]++;
      else if (slideCount <= 20) slidesDistribution["11-20"]++;
      else if (slideCount <= 30) slidesDistribution["21-30"]++;
      else slidesDistribution["30+"]++;
    });

    const slidesChartData = Object.entries(slidesDistribution).map(
      ([range, count]) => ({
        range,
        count,
      })
    );

    // Status distribution
    const statusData = [
      { name: "Active", value: activeProjects, color: "#10b981" },
      { name: "Deleted", value: deletedProjects, color: "#ef4444" },
      // { name: "Favorites", value: favoriteProjects, color: "#f59e0b" },
    ];

    // Recent projects
    const recentProjects = [...projects]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    // Calculate growth
    const lastPeriodProjects = projects.filter((p) => {
      const created = new Date(p.createdAt);
      const lastPeriodStart = {
        "7d": new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        "30d": new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        "90d": new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
        all: new Date(0),
      }[timeRange];
      return created >= lastPeriodStart && created < cutoffDate;
    }).length;

    const growth =
      lastPeriodProjects > 0
        ? ((filteredProjects.length - lastPeriodProjects) /
            lastPeriodProjects) *
          100
        : filteredProjects.length > 0
        ? 100
        : 0;

    return {
      totalProjects,
      activeProjects,
      deletedProjects,
      // favoriteProjects,
      totalSlides,
      avgSlidesPerProject,
      themeChartData,
      activityChartData,
      slidesChartData,
      statusData,
      recentProjects,
      newProjects: filteredProjects.length,
      growth: Math.round(growth),
    };
  }, [projects, timeRange]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Empty state
  if (!projects || projects.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-md"
        >
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">No Data Yet</h2>
          <p className="text-muted-foreground">
            Create your first project to see analytics and insights here
          </p>
          <Button onClick={() => (window.location.href = "/dashboard")}>
            Create Project
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into your presentation creation
            </p>
          </div>

          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Projects"
          value={analytics.totalProjects}
          icon={<FileText className="h-5 w-5" />}
          trend={
            analytics.growth > 0
              ? `+${analytics.growth}%`
              : analytics.growth < 0
              ? `${analytics.growth}%`
              : undefined
          }
          trendUp={analytics.growth > 0}
          color="blue"
        />

        <StatCard
          title="Total Slides"
          value={analytics.totalSlides}
          icon={<Layers className="h-5 w-5" />}
          subtitle={`${analytics.avgSlidesPerProject} avg per project`}
          color="purple"
        />

        <StatCard
          title="Active Projects"
          value={analytics.activeProjects}
          icon={<Activity className="h-5 w-5" />}
          subtitle={`${analytics.deletedProjects} deleted`}
          color="green"
        />

        {/* <StatCard
          title="Favorites"
          value={analytics.favoriteProjects}
          icon={<Star className="h-5 w-5 fill-current" />}
          subtitle={
            analytics.totalProjects > 0
              ? `${Math.round(
                  (analytics.favoriteProjects / analytics.totalProjects) * 100
                )}% of total`
              : "0% of total"
          }
          color="yellow"
        /> */}
      </motion.div>

      {/* Main Charts Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Activity Over Time - Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Project Creation Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.activityChartData}>
                <defs>
                  <linearGradient
                    id="colorProjects"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="projects"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProjects)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Slides Distribution - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Slides per Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.slidesChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="range"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary Charts Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Theme Distribution - Pie Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Theme Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={analytics.themeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.themeChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>

              <div className="space-y-3">
                {analytics.themeChartData.map((theme, index) => {
                  const percentage =
                    (theme.value / analytics.totalProjects) * 100;
                  return (
                    <div key={theme.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="font-medium">{theme.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {theme.value} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Status - Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Project Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={analytics.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {analytics.statusData.map((status) => (
                <div
                  key={status.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span>{status.name}</span>
                  </div>
                  <span className="font-semibold">{status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentProjects.map((project) => {
                const slideCount = Array.isArray(project.slides)
                  ? project.slides.length
                  : 1;
                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {project.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {slideCount} slides
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {project.theme}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* {project?.isFavorite && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          Favorite
                        </Badge>
                      )} */}
                      {project.isDeleted && (
                        <Badge variant="destructive" className="text-xs">
                          Deleted
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() =>
                          (window.location.href = `/ppt/${project.id}`)
                        }
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Export Analytics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Download your data or share insights with your team
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  color?: "blue" | "purple" | "green" | "yellow" | "red";
}

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  subtitle,
  color = "blue",
}: StatCardProps) => {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    green: "bg-green-500/10 text-green-500",
    yellow: "bg-yellow-500/10 text-yellow-500",
    red: "bg-red-500/10 text-red-500",
  };

  return (
    <Card className="hover:shadow-lg transition-all hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <Badge
                variant={trendUp ? "default" : "secondary"}
                className={cn(
                  "gap-1 mt-2",
                  trendUp
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                )}
              >
                {trendUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend}
              </Badge>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", colorClasses[color])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

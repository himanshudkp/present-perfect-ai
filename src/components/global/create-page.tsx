import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import RecentPrompts from "./recent-prompts";
import { usePromptStore } from "@/store/use-prompt-store";
import {
  containerVariants,
  CREATE_PAGE_CARD,
  itemVariants,
} from "@/lib/constants";
import ComparisonGuide from "./comparison-guide";
import {
  Sparkles,
  Zap,
  TrendingUp,
  ChevronRight,
  Star,
  Clock,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "../ui/card";

const cardHoverVariants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.03,
    y: -8,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
} as const;

const iconVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: 360, scale: 1.1 },
};

type Props = {
  onSelectOption: (option: string) => void;
};

const CreatePage = ({ onSelectOption }: Props) => {
  const { prompts } = usePromptStore();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const stats = [
    {
      icon: Zap,
      label: "Fast Creation",
      value: "< 2 min",
      color: "text-yellow-500",
    },
    {
      icon: Star,
      label: "Quality",
      value: "Premium",
      color: "text-purple-500",
    },
    {
      icon: Users,
      label: "Users",
      value: "10K+",
      color: "text-blue-500",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex min-h-screen flex-col items-center justify-center gap-10 p-6 sm:p-8 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="text-center space-y-6 max-w-4xl"
      >
        {/* Status Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-primary text-sm font-medium shadow-lg"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered • Ready to begin
        </motion.div>

        {/* Main Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            How would you like to
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              get started?
            </span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Choose your preferred method and create stunning presentations in
            minutes
          </p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-6 flex-wrap"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50"
            >
              <stat.icon className={cn("h-4 w-4", stat.color)} />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-sm font-semibold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        className="grid w-full max-w-6xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* {CREATE_PAGE_CARD.map((option, index) => {
          const { description, highlightedText, title, type, highlight } =
            option;
          const isHovered = hoveredCard === type;

          return (
            <motion.div
              key={type}
              variants={itemVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
              onHoverStart={() => setHoveredCard(type)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
              custom={index}
            >
              <motion.div
                variants={cardHoverVariants}
                className={cn(
                  "relative flex h-full flex-col gap-4 rounded-2xl border-2 bg-card p-6 shadow-lg transition-all duration-300 overflow-hidden",
                  highlight &&
                    "border-primary shadow-xl bg-gradient-to-br from-card to-primary/5",
                  !highlight &&
                    "border-border hover:border-primary/50 hover:shadow-xl"
                )}
              >
                {highlight && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-semibold shadow-lg flex items-center gap-1"
                  >
                    <Star className="h-3 w-3 fill-current" />
                    Recommended
                  </motion.div>
                )}

                {type === "creative-ai" && (
                  <div className="absolute top-3 left-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <TrendingUp className="h-3 w-3" />
                            Popular
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Most used by creators</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}

                <div className="flex flex-col gap-4 flex-1 pt-4">
                  <motion.div
                    variants={iconVariants}
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center shadow-md",
                      highlight
                        ? "bg-gradient-to-br from-primary to-purple-600"
                        : "bg-gradient-to-br from-muted to-muted/50"
                    )}
                  >
                    <Sparkles
                      className={cn(
                        "h-6 w-6",
                        highlight ? "text-white" : "text-primary"
                      )}
                    />
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <motion.div
                      animate={{
                        backgroundPosition: isHovered
                          ? "200% center"
                          : "0% center",
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: isHovered ? Infinity : 0,
                      }}
                      className={cn(
                        "inline-block text-sm font-semibold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent"
                      )}
                      style={{ backgroundSize: "200% auto" }}
                    >
                      {highlightedText}
                    </motion.div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {description}
                  </p>

                  {highlight && (
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Smart AI suggestions
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Professional templates
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Quick generation
                      </li>
                    </ul>
                  )}
                </div>

                <Button
                  onClick={() => onSelectOption(option.type)}
                  variant={highlight ? "default" : "outline"}
                  size="lg"
                  className={cn(
                    "w-full group/btn relative overflow-hidden",
                    highlight &&
                      "shadow-md bg-gradient-to-r from-primary to-purple-600 hover:from-primary hover:to-purple-700"
                  )}
                >
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    {highlight ? "Generate Now" : "Continue"}
                    <motion.span
                      animate={{ x: isHovered ? 4 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.span>
                  </span>
                </Button>

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.3, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={cn(
                        "absolute inset-0 -z-10 rounded-2xl blur-2xl",
                        highlight ? "bg-primary" : "bg-primary/50"
                      )}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })} */}
        {CREATE_PAGE_CARD.map((option, index) => {
          const { description, highlightedText, title, type, highlight } =
            option;
          const isHovered = hoveredCard === type;

          return (
            <motion.div
              key={type}
              variants={itemVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
              onHoverStart={() => setHoveredCard(type)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
              custom={index}
            >
              <motion.div variants={cardHoverVariants} className="h-full">
                <Card
                  className={cn(
                    "p-6 flex flex-col h-full border-2 rounded-2xl transition-all duration-300 relative group overflow-hidden cursor-pointer",
                    highlight
                      ? "border-primary shadow-xl bg-primary/5"
                      : "border-border hover:border-primary/50 hover:shadow-xl"
                  )}
                  onClick={() => onSelectOption(option.type)}
                >
                  {/* Background Gradient */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-primary via-primary/50 to-transparent pointer-events-none"
                  />

                  {/* Header with Badge and Number */}
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300",
                        isHovered
                          ? "bg-primary text-primary-foreground shadow-lg scale-110"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col items-end gap-2">
                      {highlight && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-semibold shadow-lg flex items-center gap-1"
                        >
                          <Star className="h-3 w-3 fill-current" />
                          Recommended
                        </motion.div>
                      )}

                      {type === "creative-ai" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                variant="secondary"
                                className="gap-1 text-xs"
                              >
                                <TrendingUp className="h-3 w-3" />
                                Popular
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Most used by creators</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 mb-4 relative z-10">
                    {/* Icon */}
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.1 : 1,
                        rotate: isHovered ? [0, -5, 5, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                        highlight
                          ? "bg-gradient-to-br from-primary to-purple-600 shadow-lg"
                          : "bg-muted"
                      )}
                    >
                      <Sparkles
                        className={cn(
                          "h-7 w-7",
                          highlight ? "text-white" : "text-primary"
                        )}
                      />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>

                    {/* Highlighted Text */}
                    <motion.div
                      animate={{
                        backgroundPosition: isHovered
                          ? "200% center"
                          : "0% center",
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: isHovered ? Infinity : 0,
                      }}
                      className="inline-block text-sm font-semibold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent mb-3"
                      style={{ backgroundSize: "200% auto" }}
                    >
                      {highlightedText}
                    </motion.div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {description}
                    </p>

                    {/* Features for highlighted card */}
                    {highlight && (
                      <motion.ul
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 space-y-2 text-xs text-muted-foreground"
                      >
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Smart AI suggestions
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Professional templates
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Quick generation
                        </li>
                      </motion.ul>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="relative z-10">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOption(option.type);
                      }}
                      variant={highlight ? "default" : "outline"}
                      size="lg"
                      className={cn(
                        "w-full gap-2 relative overflow-hidden",
                        highlight &&
                          "shadow-md bg-gradient-to-r from-primary to-purple-600 hover:from-primary hover:to-purple-700"
                      )}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {highlight ? "Generate Now" : "Continue"}
                        <motion.span
                          animate={{ x: isHovered ? 4 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.span>
                      </span>
                    </Button>
                  </div>

                  {/* Shine Effect */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: isHovered ? "100%" : "-100%" }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                  />

                  {/* Hover Glow */}
                  <AnimatePresence>
                    {isHovered && highlight && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 -z-10 rounded-2xl bg-primary/10 blur-xl"
                      />
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Help Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Average creation time: 2-5 minutes</span>
        </div>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Need help deciding?{" "}
          </span>
          <button
            onClick={() => setShowGuide(true)}
            className="text-sm text-primary hover:underline font-semibold transition-colors inline-flex items-center gap-1"
          >
            View comparison guide
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Recent Prompts Section */}
      <AnimatePresence>
        {prompts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            variants={itemVariants}
            className="w-full max-w-6xl"
          >
            <RecentPrompts />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Guide Modal */}
      <AnimatePresence>
        {showGuide && <ComparisonGuide onClose={() => setShowGuide(false)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreatePage;

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Zap,
  Settings,
  FileText,
  Clock,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "@/utils/utils";

type ComparisonOption = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  bestFor: string[];
  features: { text: string; available: boolean }[];
  speed: number;
  complexity: number;
};

const comparisonData: ComparisonOption[] = [
  {
    id: "quick",
    title: "Quick Start",
    icon: <Zap className="w-6 h-6" />,
    description: "AI-powered setup with smart suggestions",
    bestFor: ["Beginners", "Fast prototyping", "Simple projects"],
    features: [
      { text: "AI-guided setup", available: true },
      { text: "Smart suggestions", available: true },
      { text: "Quick turnaround", available: true },
      { text: "Custom configuration", available: false },
      { text: "Advanced options", available: false },
    ],
    speed: 95,
    complexity: 20,
  },
  {
    id: "manual",
    title: "Manual Setup",
    icon: <Settings className="w-6 h-6" />,
    description: "Complete control over every setting",
    bestFor: ["Experienced users", "Complex projects", "Custom requirements"],
    features: [
      { text: "Full customization", available: true },
      { text: "Advanced settings", available: true },
      { text: "Granular control", available: true },
      { text: "AI assistance", available: false },
      { text: "Quick setup", available: false },
    ],
    speed: 40,
    complexity: 90,
  },
  {
    id: "template",
    title: "Use Template",
    icon: <FileText className="w-6 h-6" />,
    description: "Pre-built templates ready to customize",
    bestFor: ["Quick projects", "Standard workflows", "Learning examples"],
    features: [
      { text: "Ready-made designs", available: true },
      { text: "Easy customization", available: true },
      { text: "Industry standards", available: true },
      { text: "From scratch", available: false },
      { text: "Blank canvas", available: false },
    ],
    speed: 80,
    complexity: 35,
  },
];

type Props = {
  onClose?: () => void;
};

const ComparisonGuide = ({ onClose }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="p-8 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Comparison Guide
            </motion.div>
            <h2 className="text-4xl font-bold mb-3">Choose Your Path</h2>
            <p className="text-muted-foreground text-lg">
              Compare features to find the best option for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {comparisonData.map((option, index) => {
              const isSelected = selectedOption === option.id;

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    setSelectedOption(isSelected ? null : option.id)
                  }
                  className="cursor-pointer"
                >
                  <Card
                    className={cn(
                      "p-6 h-full border-2 transition-all duration-300",
                      isSelected && "border-primary shadow-xl bg-primary/5"
                    )}
                  >
                    <div className="mb-4">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {option.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {option.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Speed
                          </span>
                          <span className="font-semibold">{option.speed}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${option.speed}%` }}
                            transition={{
                              delay: index * 0.1 + 0.3,
                              duration: 0.6,
                            }}
                            className="h-full bg-green-500 rounded-full"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Settings className="w-3 h-3" />
                            Complexity
                          </span>
                          <span className="font-semibold">
                            {option.complexity}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${option.complexity}%` }}
                            transition={{
                              delay: index * 0.1 + 0.4,
                              duration: 0.6,
                            }}
                            className="h-full bg-orange-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-1 text-xs font-semibold mb-2">
                        <Users className="w-3 h-3" />
                        Best for:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {option.bestFor.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-1 bg-muted rounded-full text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="text-xs font-semibold mb-3">
                        Features:
                      </div>
                      <div className="space-y-2">
                        {option.features.map((feature) => (
                          <div
                            key={feature.text}
                            className="flex items-center gap-2 text-sm"
                          >
                            {feature.available ? (
                              <Check className="w-4 h-4 text-green-500 shrink-0" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                            )}
                            <span
                              className={cn(
                                feature.available
                                  ? "text-foreground"
                                  : "text-muted-foreground line-through"
                              )}
                            >
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="mt-4 py-2 px-3 bg-primary text-primary-foreground rounded-lg text-center text-sm font-semibold"
                        >
                          Selected ✓
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Still not sure? You can always switch methods later.
            </p>
            <Button onClick={onClose} size="lg" className="rounded-xl px-8">
              Got it, thanks!
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ComparisonGuide;

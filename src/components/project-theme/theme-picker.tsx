"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Wand2, Check, Palette, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { showError, showSuccess } from "../toast-message";
import { ThemeCard } from "./theme-card";
import { useSlideStore } from "@/store/use-slide-store";
import { THEMES } from "@/constants";
import type { Slide, Theme } from "@/types";
import { generateLayouts } from "@/actions/ai";

const HEADER_ANIMATION = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
} as const;

const BUTTON_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.2 },
} as const;

const GRID_ANIMATION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay: 0.3 },
} as const;

const PALETTE_ICON_ANIMATION = {
  animate: { rotate: [0, 10, -10, 0] },
  transition: { duration: 2, repeat: Infinity, repeatDelay: 3 },
};

const BUTTON_SHINE_ANIMATION = {
  animate: { x: ["-100%", "200%"] },
  transition: { duration: 1.5, repeat: Infinity, repeatDelay: 1 },
};

interface ThemePickerProps {
  selectedTheme: Theme;
  themes: Theme[];
  onSelectTheme: (theme: Theme) => void;
}

const ThemePicker = ({
  selectedTheme,
  themes,
  onSelectTheme,
}: ThemePickerProps) => {
  const router = useRouter();
  const { presentationId } = useParams();
  const { project, setSlides, currentTheme } = useSlideStore();
  const [loading, setLoading] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const handleGenerateLayouts = useCallback(async () => {
    setLoading(true);

    if (!selectedTheme) {
      showError("Error", "Please select a theme.");
      setLoading(false);
      return;
    }

    if (project?.id === "") {
      showError("Error", "Please create a project.");
      router.push("/new-project");
      setLoading(false);
      return;
    }

    try {
      const res = await generateLayouts(
        presentationId as string,
        currentTheme.name
      );

      if (res.status !== 200 || !res.data) {
        showError("Error", "Failed to generate layouts");
        return;
      }

      showSuccess("Success", "Layouts generated successfully");
      router.push(`/presentation/${presentationId}`);
      setSlides(res.data as Slide[]);
    } catch (error) {
      console.error("Error while generating layouts: ", error);
      showError("Error", "Failed to generate layouts");
    } finally {
      setLoading(false);
    }
  }, [
    selectedTheme,
    project,
    presentationId,
    currentTheme.name,
    router,
    setSlides,
  ]);

  const containerStyle = useMemo(
    () => ({
      backgroundColor: selectedTheme.sidebarColor || selectedTheme.bgColor,
      borderLeft: `2px solid ${selectedTheme.accentColor}20`,
    }),
    [
      selectedTheme.sidebarColor,
      selectedTheme.bgColor,
      selectedTheme.accentColor,
    ]
  );

  const backgroundGradient = useMemo(
    () => ({
      background: `radial-gradient(circle at top right, ${selectedTheme.accentColor}, transparent 60%)`,
    }),
    [selectedTheme.accentColor]
  );

  const headerTitleStyle = useMemo(
    () => ({
      color: selectedTheme.accentColor,
      textShadow: `0 0 40px ${selectedTheme.accentColor}20`,
    }),
    [selectedTheme.accentColor]
  );

  const selectedIndicatorStyle = useMemo(
    () => ({
      backgroundColor: `${selectedTheme.accentColor}15`,
      color: selectedTheme.accentColor,
    }),
    [selectedTheme.accentColor]
  );

  const generateButtonStyle = useMemo(
    () => ({
      backgroundColor: selectedTheme.accentColor,
      color: selectedTheme.bgColor,
    }),
    [selectedTheme.accentColor, selectedTheme.bgColor]
  );

  return (
    <div
      className="w-[480px] overflow-hidden sticky top-0 h-screen flex flex-col"
      style={containerStyle}
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={backgroundGradient}
      />

      <div className="p-8 space-y-6 shrink-0 relative z-10">
        <motion.div className="space-y-3" {...HEADER_ANIMATION}>
          <div className="flex items-center gap-3">
            <motion.div {...PALETTE_ICON_ANIMATION}>
              <Palette
                className="w-8 h-8"
                style={{ color: selectedTheme.accentColor }}
              />
            </motion.div>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={headerTitleStyle}
            >
              Pick a Theme
            </h2>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: `${selectedTheme.fontColor}70` }}
          >
            Choose from our curated collection of themes designed for every
            style
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-xs font-medium py-2 px-3 rounded-lg"
            style={selectedIndicatorStyle}
          >
            <Check className="w-4 h-4" />
            <span>Current: {selectedTheme.name}</span>
          </motion.div>
        </motion.div>

        <motion.div {...BUTTON_ANIMATION}>
          <Button
            className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            style={generateButtonStyle}
            onClick={handleGenerateLayouts}
            disabled={loading}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
              {...BUTTON_SHINE_ANIMATION}
            />

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="animate-pulse">Generating magic...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Presentation</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        <div className="flex items-center gap-3">
          <div
            className="h-px flex-1"
            style={{ backgroundColor: `${selectedTheme.accentColor}20` }}
          />
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: `${selectedTheme.fontColor}50` }}
          >
            {themes.length} Themes
          </span>
          <div
            className="h-px flex-1"
            style={{ backgroundColor: `${selectedTheme.accentColor}20` }}
          />
        </div>
      </div>

      <ScrollArea className="grow px-8 pb-8 relative z-10 h-screen">
        <motion.div className="grid grid-cols-1 gap-4" {...GRID_ANIMATION}>
          {THEMES.map((theme, index) => (
            <ThemeCard
              key={theme.name}
              theme={theme}
              isSelected={selectedTheme.name === theme.name}
              isHovered={hoveredTheme === theme.name}
              onSelect={() => onSelectTheme(theme)}
              onHoverStart={() => setHoveredTheme(theme.name)}
              onHoverEnd={() => setHoveredTheme(null)}
              index={index}
            />
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
};

export default ThemePicker;

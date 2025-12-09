"use client";

import { useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import type { Theme } from "@/lib/types";

const CHECK_ICON_ANIMATION = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  exit: { scale: 0, rotate: 180 },
  transition: { type: "spring", stiffness: 300, damping: 20 },
} as const;

const INDICATOR_BAR_ANIMATION = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  exit: { scaleX: 0 },
  transition: { duration: 0.3 },
};
export const ThemeCard = memo(
  ({
    theme,
    isSelected,
    isHovered,
    onSelect,
    onHoverStart,
    onHoverEnd,
    index,
  }: {
    theme: Theme;
    isSelected: boolean;
    isHovered: boolean;
    onSelect: () => void;
    onHoverStart: () => void;
    onHoverEnd: () => void;
    index: number;
  }) => {
    const colorPalette = useMemo(
      () => [theme.bgColor, theme.accentColor, theme.fontColor],
      [theme.bgColor, theme.accentColor, theme.fontColor]
    );

    const buttonStyle = useMemo(
      () => ({
        fontFamily: theme.fontFamily,
        color: theme.fontColor,
        backgroundColor: theme.gradientBgColor || theme.bgColor,
        borderColor: isSelected ? theme.accentColor : `${theme.accentColor}30`,
        borderWidth: "2px",
        borderStyle: "solid" as const,
        ringColor: theme.accentColor,
        boxShadow: isSelected
          ? `0 8px 24px ${theme.accentColor}40, 0 0 0 1px ${theme.accentColor}20`
          : `0 2px 8px ${theme.accentColor}15`,
      }),
      [theme, isSelected]
    );

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.03, x: 4 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
      >
        <Button
          className={`flex flex-col items-start justify-start w-full h-auto p-5 relative overflow-hidden transition-all duration-300 ${
            isSelected ? "ring-2" : ""
          }`}
          style={buttonStyle}
          onClick={onSelect}
        >
          <motion.div
            className="absolute inset-0 opacity-0"
            style={{
              background: `linear-gradient(135deg, ${theme.accentColor}20, transparent 60%)`,
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="w-full flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <motion.span
                className="text-xl font-bold"
                animate={{ x: isSelected ? [0, 2, 0] : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme.name}
              </motion.span>
              <AnimatePresence>
                {isSelected && (
                  <motion.div {...CHECK_ICON_ANIMATION}>
                    <Check
                      className="w-5 h-5"
                      style={{ color: theme.accentColor }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
              animate={{
                scale: isHovered ? 1.2 : 1,
                boxShadow: isHovered
                  ? `0 0 12px ${theme.accentColor}80`
                  : `0 0 0px ${theme.accentColor}`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="space-y-2 w-full relative z-10">
            <motion.div
              className="text-2xl font-bold"
              style={{ color: theme.accentColor }}
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              Title Preview
            </motion.div>
            <div className="text-sm" style={{ color: `${theme.fontColor}80` }}>
              Body text with{" "}
              <span
                className="font-semibold underline decoration-2"
                style={{ color: theme.accentColor }}
              >
                accent link
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              {colorPalette.map((color, i) => (
                <motion.div
                  key={i}
                  className="w-6 h-6 rounded border"
                  style={{
                    backgroundColor: color,
                    borderColor: `${theme.accentColor}30`,
                  }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
              ))}
            </div>
          </div>

          <AnimatePresence>
            {isSelected && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: theme.accentColor }}
                {...INDICATOR_BAR_ANIMATION}
              />
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    );
  }
);

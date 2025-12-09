"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccess } from "../toast-message";

const THEMES = [
  {
    name: "system",
    icon: Monitor,
    label: "System theme",
    key: "system",
    description: "Use system settings",
  },
  {
    name: "dark",
    icon: Moon,
    label: "Dark theme",
    key: "dark",
    description: "Dark mode",
  },
  {
    name: "light",
    icon: Sun,
    label: "Light theme",
    key: "light",
    description: "Light mode",
  },
];

const THEME_BUTTON_ANIM = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
} as const;

const ACTIVE_THEME_ANIMATION = {
  type: "spring",
  duration: 0.4,
  bounce: 0.3,
} as const;

const activeThemeAnimation = (
  isActive: boolean
): {
  rotate: number;
  scale: number;
} => {
  return {
    rotate: isActive ? 360 : 0,
    scale: isActive ? 1.1 : 1,
  };
};

const INITIAL_EXIT_ANIM = { opacity: 0, scale: 0.8, y: -5 } as const;
const MOTION_ANIMATE = { opacity: 1, scale: 1, y: 0 } as const;

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const handleThemeClick = useCallback(
    (themeKey: string) => {
      setTheme(themeKey);

      const themeName =
        THEMES.find((t) => t.key === themeKey)?.name || themeKey;

      showSuccess("Success", `Switched to ${themeName} theme`);
    },
    [setTheme]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = THEMES.findIndex((t) => t.key === theme);

      if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % THEMES.length;
        handleThemeClick(THEMES[nextIndex].key);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + THEMES.length) % THEMES.length;
        handleThemeClick(THEMES[prevIndex].key);
      }
    },
    [theme, handleThemeClick]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />;
  }

  return (
    <div
      className={cn(
        "relative isolate flex items-center h-10 rounded-full",
        "bg-muted border border-border transition-all duration-200",
        "p-1 gap-0.5"
      )}
      onKeyDown={handleKeyDown}
      role="radiogroup"
      aria-label="Theme selector"
      tabIndex={0}
    >
      <AnimatePresence mode="wait">
        {THEMES.map(({ key, icon: Icon, label, description }) => {
          const isActive = theme === key;

          return (
            <motion.button
              key={key}
              aria-label={label}
              aria-checked={isActive}
              aria-description={description}
              role="radio"
              className={cn(
                "relative h-8 w-8 rounded-full flex items-center justify-center",
                "transition-colors duration-200",
                "hover:bg-background/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isActive && "hover:bg-transparent"
              )}
              onClick={() => handleThemeClick(key)}
              onMouseEnter={() => setHoveredTheme(key)}
              onMouseLeave={() => setHoveredTheme(null)}
              type="button"
              title={`Switch to ${label.toLowerCase()}`}
              {...THEME_BUTTON_ANIM}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-linear-to-br from-primary/20 to-primary/10 border border-primary/30"
                  layoutId="activeTheme"
                  transition={ACTIVE_THEME_ANIMATION}
                />
              )}

              <motion.div
                animate={activeThemeAnimation(isActive)}
                transition={{
                  duration: isActive ? 0.5 : 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                className="relative z-10"
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                />
              </motion.div>

              {hoveredTheme === key && !isActive && (
                <motion.div
                  initial={INITIAL_EXIT_ANIM}
                  animate={MOTION_ANIMATE}
                  exit={INITIAL_EXIT_ANIM}
                  transition={{ duration: 0.2 }}
                  className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap pointer-events-none z-50 shadow-lg"
                >
                  {description}
                  <motion.div className=" absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-foreground" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;

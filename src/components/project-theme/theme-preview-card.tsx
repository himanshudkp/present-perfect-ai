"use client";

import type { ReactNode } from "react";
import { type LegacyAnimationControls, motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { Theme } from "@/types";

const createSpringTransition = (delay: number) => ({
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  delay,
  filter: { duration: 0.4 },
});

const VARIANTS = {
  left: {
    hidden: {
      opacity: 0,
      x: "-50%",
      y: "-50%",
      scale: 0.8,
      rotate: 0,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      x: "-25%",
      y: "-25%",
      scale: 0.95,
      rotate: -10,
      filter: "blur(0px)",
      transition: createSpringTransition(0.1),
    },
  },
  right: {
    hidden: {
      opacity: 0,
      x: "50%",
      y: "50%",
      scale: 0.8,
      rotate: 0,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      x: "25%",
      y: "25%",
      scale: 0.95,
      rotate: 10,
      filter: "blur(0px)",
      transition: createSpringTransition(0.15),
    },
  },
  main: {
    hidden: {
      opacity: 0,
      scale: 0.85,
      y: 20,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: createSpringTransition(0.25),
    },
  },
} as const;

const IMAGE_URLS = {
  left: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop",
  main: "https://images.unsplash.com/photo-1513077202514-c511b41bd4c7?q=80&w=2069&auto=format&fit=crop",
  right:
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2087&auto=format&fit=crop",
} as const;

const SPARKLE_ANIMATION = {
  initial: { rotate: 0, scale: 1 },
  animate: {
    rotate: [0, 10, -10, 0],
    scale: [1, 1.1, 1.1, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatDelay: 3,
    ease: "easeInOut" as const,
  },
};

const BORDER_PULSE_ANIMATION = {
  animate: { opacity: [0.3, 0.6, 0.3] },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const MAIN_HOVER_ANIMATION = {
  scale: 1.02,
  transition: { duration: 0.3, ease: "easeOut" },
} as const;

const IMAGE_HOVER_ANIMATION = {
  scale: 1.05,
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

const getProgressBarDelay = (variant: "left" | "main" | "right") => {
  const delays = { left: 0.3, main: 0.5, right: 0.4 };
  return delays[variant];
};

interface ThemePreviewCardProps {
  title: string;
  description: string;
  content: ReactNode;
  variant: "left" | "main" | "right";
  theme: Theme;
  controls: LegacyAnimationControls;
}

const ThemePreviewCard = ({
  content,
  controls,
  description,
  theme,
  title,
  variant,
}: ThemePreviewCardProps) => {
  const isMain = variant === "main";
  const imageUrl = IMAGE_URLS[variant];

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={VARIANTS[variant]}
      className={`absolute w-full max-w-3xl ${
        !isMain ? "pointer-events-none" : ""
      }`}
      whileHover={isMain ? MAIN_HOVER_ANIMATION : undefined}
    >
      <Card
        className={`w-full shadow-2xl backdrop-blur-sm overflow-hidden transition-all duration-500 ${
          isMain ? "hover:shadow-3xl" : ""
        }`}
        style={{
          backgroundColor: theme.bgColor,
          border: `2px solid ${theme.accentColor}25`,
          boxShadow: `0 20px 60px -15px ${theme.accentColor}40, 0 0 0 1px ${theme.accentColor}10`,
        }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${theme.accentColor}, transparent 70%)`,
          }}
        />

        <div className="flex flex-col md:flex-row relative">
          <CardContent className="flex-1 p-8 md:p-10 space-y-6 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {isMain && (
                  <motion.div {...SPARKLE_ANIMATION}>
                    <Sparkles
                      className="w-6 h-6"
                      style={{ color: theme.accentColor }}
                    />
                  </motion.div>
                )}
                <h2
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{
                    color: theme.accentColor,
                    textShadow: `0 0 40px ${theme.accentColor}20`,
                  }}
                >
                  {title}
                </h2>
              </div>

              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: `${theme.fontColor}80` }}
              >
                {description}
              </p>

              <div
                className="h-1 w-20 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${theme.accentColor}, transparent)`,
                }}
              />
            </div>

            <div className="pt-2">{content}</div>
          </CardContent>

          <div className="relative w-full md:w-1/2 h-80 md:h-auto overflow-hidden rounded-b-lg md:rounded-b-none md:rounded-r-lg group">
            <div
              className="absolute inset-0 z-10 opacity-30 group-hover:opacity-20 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${theme.accentColor}40, transparent 60%)`,
              }}
            />

            <motion.div
              className="absolute inset-0 z-20"
              style={{
                border: `1px solid ${theme.accentColor}30`,
              }}
              {...BORDER_PULSE_ANIMATION}
            />

            <motion.div
              className="relative w-full h-full"
              whileHover={isMain ? IMAGE_HOVER_ANIMATION : undefined}
            >
              <Image
                src={imageUrl}
                alt={`${title} theme preview`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                className="transition-all duration-700 group-hover:brightness-110"
                priority={isMain}
              />
            </motion.div>

            <div
              className="absolute bottom-0 right-0 w-24 h-24 opacity-20"
              style={{
                background: `radial-gradient(circle at bottom right, ${theme.accentColor}, transparent 70%)`,
              }}
            />
          </div>
        </div>

        <motion.div
          className="h-1 w-full"
          style={{ backgroundColor: theme.accentColor }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.8,
            delay: getProgressBarDelay(variant),
            ease: "easeOut",
          }}
        />
      </Card>
    </motion.div>
  );
};

export default ThemePreviewCard;

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAnimation } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { THEMES } from "@/utils/constants";
import SuccessToast from "./success-toast";
import { MainCardContent } from "./main-card-content";
import { RightCardContent } from "./right-card-content";
import { LeftCardContent } from "./left-card-content";
import ThemePicker from "./theme-picker";
import ThemePreviewCard from "./theme-preview-card";
import { useSlideStore } from "@/store/use-slide-store";
import type { Theme } from "@/types";

const ThemePreview = () => {
  const router = useRouter();
  const { currentTheme, setCurrentTheme } = useSlideStore();
  const controls = useAnimation();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [showSuccess, setShowSuccess] = useState(false);
  const { accentColor, bgColor, fontColor, fontFamily } = selectedTheme;

  const themeIndex = useMemo(
    () => THEMES.findIndex((t) => t.name === selectedTheme.name) + 1,
    [selectedTheme.name]
  );

  useEffect(() => {
    controls.start("visible");
  }, [controls, selectedTheme]);

  const handleApplyTheme = useCallback(
    async (theme: Theme) => {
      setSelectedTheme(theme);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setCurrentTheme(theme);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    },
    [setCurrentTheme]
  );

  const handleBackClick = useCallback(() => {
    router.push("/new-project");
  }, [router]);

  return (
    <div
      className="h-screen w-full flex relative"
      style={{
        backgroundColor: bgColor,
        color: fontColor,
        fontFamily: fontFamily,
      }}
    >
      <SuccessToast theme={selectedTheme} show={showSuccess} />

      <div className="grow overflow-y-auto">
        <div className="p-12 flex flex-col items-center min-h-screen">
          <div className="w-full max-w-7xl mb-12 flex items-center justify-between">
            <Button
              variant="outline"
              size="lg"
              className="transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: `${accentColor}10`,
                color: accentColor,
                borderColor: `${accentColor}30`,
              }}
              onClick={handleBackClick}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span>Back to Projects</span>
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: `${fontColor}80` }}>
                {themeIndex} / {THEMES.length}
              </span>
            </div>
          </div>

          <div className="w-full flex justify-center relative grow">
            <ThemePreviewCard
              content={<LeftCardContent selectedTheme={selectedTheme} />}
              controls={controls}
              description="Get up and running in no time"
              theme={selectedTheme}
              title="Quick Start"
              variant="left"
            />
            <ThemePreviewCard
              content={<MainCardContent selectedTheme={selectedTheme} />}
              controls={controls}
              description="Experience the full power of your theme"
              theme={selectedTheme}
              title="Main Preview"
              variant="main"
            />
            <ThemePreviewCard
              content={<RightCardContent selectedTheme={selectedTheme} />}
              controls={controls}
              description="Discover what this theme can do"
              theme={selectedTheme}
              title="Theme Features"
              variant="right"
            />
          </div>
        </div>
      </div>

      <ThemePicker
        selectedTheme={currentTheme}
        themes={THEMES}
        onSelectTheme={handleApplyTheme}
      />
    </div>
  );
};

export default ThemePreview;

"use client";

import { useMemo } from "react";
import { Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "./feature-card";
import { Theme } from "@/lib/types";

export function LeftCardContent({ selectedTheme }: { selectedTheme: Theme }) {
  const { accentColor, bgColor } = selectedTheme;
  const leftCardContent = useMemo(
    () => (
      <div className="space-y-4">
        <FeatureCard
          theme={selectedTheme}
          icon={Zap}
          title="Quick Start Guide"
          hoverable={false}
        >
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Choose a theme that fits your style</li>
            <li>Customize colors and fonts</li>
            <li>Add your content with ease</li>
            <li>Preview and publish your work</li>
          </ol>
        </FeatureCard>

        <Button
          className="w-full h-12 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{
            backgroundColor: accentColor,
            color: bgColor,
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Get Started
        </Button>
      </div>
    ),
    [selectedTheme]
  );

  return leftCardContent;
}

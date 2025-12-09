"use client";

import { useMemo } from "react";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "./feature-card";
import type { Theme } from "@/lib/types";

export function RightCardContent({ selectedTheme }: { selectedTheme: Theme }) {
  const { accentColor, bgColor } = selectedTheme;
  const rightCardContent = useMemo(
    () => (
      <div className="space-y-4">
        <FeatureCard
          theme={selectedTheme}
          icon={Palette}
          title="Theme Features"
          hoverable={false}
        >
          <ul className="space-y-2 text-sm">
            {[
              "Fully responsive design for all devices",
              "Dark and light mode support",
              "Custom color schemes and palettes",
              "Accessibility optimized for everyone",
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: selectedTheme.accentColor }}
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </FeatureCard>

        <Button
          variant="outline"
          className="w-full h-12 font-medium transition-all duration-300 hover:scale-105"
          style={{
            borderColor: accentColor,
            color: accentColor,
          }}
        >
          Explore All Features
        </Button>
      </div>
    ),
    [selectedTheme]
  );

  return rightCardContent;
}

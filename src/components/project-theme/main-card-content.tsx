"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import FeatureCard from "./feature-card";
import type { Theme } from "@/lib/types";

export function MainCardContent({ selectedTheme }: { selectedTheme: Theme }) {
  const { accentColor, bgColor } = selectedTheme;
  const mainCardContent = useMemo(
    () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            theme={selectedTheme}
            title="Smart Layouts"
            hoverable={true}
          >
            <p className="text-sm">
              Intelligent text boxes that adapt to your content seamlessly.
            </p>
          </FeatureCard>

          <FeatureCard theme={selectedTheme} title="Easy Commands">
            <p className="text-sm">
              Simply type{" "}
              <code className="px-2 py-1 rounded bg-black/10">/smart</code> to
              access these layouts.
            </p>
          </FeatureCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard theme={selectedTheme} title="Flexible Design">
            <p className="text-sm">
              Responsive components that look great on any device.
            </p>
          </FeatureCard>

          <FeatureCard theme={selectedTheme} title="Rich Features">
            <p className="text-sm">
              Everything you need to create stunning presentations.
            </p>
          </FeatureCard>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button
            className="h-12 px-6 text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: accentColor,
              color: bgColor,
            }}
          >
            Primary Action
          </Button>

          <Button
            variant="outline"
            className="h-12 px-6 text-base font-medium transition-all duration-300 hover:scale-105"
            style={{
              borderColor: selectedTheme.accentColor,
              color: selectedTheme.accentColor,
            }}
          >
            Secondary Action
          </Button>
        </div>
      </div>
    ),
    [selectedTheme]
  );

  return mainCardContent;
}

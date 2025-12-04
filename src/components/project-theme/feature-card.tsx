"use client";

import { memo, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Theme } from "@/types";

interface FeatureCard {
  theme: Theme;
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
  hoverable?: boolean;
}
const FeatureCard = ({
  children,
  hoverable,
  icon: Icon,
  theme,
  title,
}: FeatureCard) => {
  const { accentColor, fontColor } = theme;
  return (
    <div
      className={`rounded-xl p-6 transition-all duration-300 ${
        hoverable ? "hover:shadow-md hover:scale-105" : "hover:shadow-lg"
      }`}
      style={{
        backgroundColor: `${accentColor}${hoverable ? "10" : "15"}`,
        border: `1px solid ${accentColor}${hoverable ? "15" : "20"}`,
      }}
    >
      {Icon && (
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
          <h3 className="text-xl font-semibold" style={{ color: accentColor }}>
            {title}
          </h3>
        </div>
      )}
      {!Icon && title && (
        <h4 className="font-semibold mb-2" style={{ color: accentColor }}>
          {title}
        </h4>
      )}
      <div style={{ color: fontColor }}>{children}</div>
    </div>
  );
};

export default memo(FeatureCard);

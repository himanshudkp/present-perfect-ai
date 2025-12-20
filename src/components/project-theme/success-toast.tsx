"use client";

import { memo } from "react";
import { Check } from "lucide-react";
import type { Theme } from "@/types";

const SuccessToast = ({ theme, show }: { theme: Theme; show: boolean }) => {
  if (!show) return null;

  return (
    <div
      className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top duration-300"
      style={{
        backgroundColor: theme.accentColor,
        color: theme.bgColor,
      }}
    >
      <Check className="w-5 h-5" />
      <span className="font-medium">Theme applied successfully!</span>
    </div>
  );
};

export default memo(SuccessToast);

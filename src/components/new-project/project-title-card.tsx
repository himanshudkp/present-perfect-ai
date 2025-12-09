"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

const ANIMATION = {
  initial: { opacity: 0, y: -5 },
  animate: { opacity: 1, y: 0 },
} as const;

interface ProjectTitleCardProps {
  title: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ProjectTitleCard = memo(
  ({
    title,
    onChange,
    disabled = false,
    placeholder = "E.g., Digital Marketing Strategy 2025",
  }: ProjectTitleCardProps) => {
    return (
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Presentation Title *
            </label>
            <div className="flex gap-5">
              <Input
                value={title}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="text-base"
                disabled={disabled}
              />
              {title.trim() && (
                <motion.div
                  initial={ANIMATION.initial}
                  animate={ANIMATION.animate}
                  className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                >
                  <CheckCircle className="h-4 w-4" />
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

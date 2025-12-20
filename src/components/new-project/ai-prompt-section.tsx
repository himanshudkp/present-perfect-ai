"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Brain, Loader2, Wand2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/utils";
import { ITEM_VARIANTS } from "@/constants";

const NO_OF_SLIDES = [3, 5, 6, 7, 10, 15, 20] as const;

interface AIPromptSectionProps {
  currentAIPrompt: string;
  isGenerating: boolean;
  isCreating: boolean;
  noOfCards: string;
  generateOutline: () => Promise<void>;
  setNoOfCards: React.Dispatch<React.SetStateAction<string>>;
  setCurrentAIPrompt: (prompt: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const AIPromptSection = ({
  currentAIPrompt,
  isGenerating,
  isCreating,
  noOfCards,
  generateOutline,
  setCurrentAIPrompt,
  setNoOfCards,
  onKeyDown,
}: AIPromptSectionProps) => {
  return (
    <motion.div
      className={cn(
        "p-3 rounded-lg border transition-all duration-200",
        currentAIPrompt.trim()
          ? "border-primary/50 bg-primary/5"
          : "border-border/50 bg-muted/30"
      )}
      variants={ITEM_VARIANTS}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Brain className="h-4 w-4 text-primary text-sm" />
          AI Generation
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">
            Describe Your Presentation
          </label>
          <Input
            value={currentAIPrompt || ""}
            onChange={(e) => setCurrentAIPrompt(e.target.value)}
            placeholder="E.g., Digital marketing trends for Q1 2025..."
            className="text-sm border-0 focus-visible:ring-1 focus-visible:ring-primary rounded-md bg-background"
            disabled={isGenerating || isCreating}
            onKeyDown={onKeyDown}
          />
          <p className="text-xs text-muted-foreground">
            Be specific about topic, audience, and key points
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-32">
            <label className="text-xs font-semibold text-foreground block mb-1">
              Slides
            </label>
            <Select
              value={noOfCards}
              onValueChange={setNoOfCards}
              disabled={isGenerating || isCreating}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {NO_OF_SLIDES.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} slides
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-5">
            <Button
              onClick={generateOutline}
              disabled={!currentAIPrompt.trim() || isGenerating || isCreating}
              size="sm"
              className="gap-1"
            >
              {isGenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Wand2 className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Generate With AI</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(AIPromptSection);

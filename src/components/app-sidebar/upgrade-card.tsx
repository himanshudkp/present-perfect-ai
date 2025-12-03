"use client";

import { memo } from "react";
import { Brain, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const UpgradeCard = ({ onUpgrade }: { onUpgrade: () => void }) => (
  <div className="w-full flex flex-col gap-3 p-4 rounded-lg bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-colors duration-200">
    <div className="flex items-start gap-2">
      <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-sm font-semibold text-primary">Unlock Creative AI</p>
        <p className="text-xs text-muted-foreground">
          Get access to AI-powered features and more
        </p>
      </div>
    </div>
    <Button
      onClick={onUpgrade}
      className="w-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
      size="sm"
      aria-label="Upgrade to premium"
    >
      Upgrade
      <ChevronRight className="h-4 w-4 ml-1" />
    </Button>
  </div>
);

export default memo(UpgradeCard);

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBannerProps {
  cardCount: number;
  presentationTitle: string;
  hasGeneratedSlides?: boolean;
  isReady: boolean;
}

export const StatusBanner = ({
  cardCount,
  presentationTitle,
  hasGeneratedSlides = false,
  isReady,
}: StatusBannerProps) => {
  if (!cardCount && !presentationTitle.trim()) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-lg border",
        isReady
          ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
          : hasGeneratedSlides
          ? "bg-primary/5 border-primary/30 text-primary"
          : "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400"
      )}
    >
      <div className="flex items-center gap-3">
        {isReady ? (
          <CheckCircle className="h-5 w-5 shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 shrink-0" />
        )}
        <div>
          <p className="font-medium">
            {presentationTitle.trim()
              ? `"${presentationTitle}"`
              : "Untitled Presentation"}
          </p>
          <p className="text-sm opacity-75">
            {cardCount > 0 ? (
              <>
                {hasGeneratedSlides ? "✨" : "📝"} {cardCount} slide
                {cardCount !== 1 ? "s" : ""}{" "}
                {hasGeneratedSlides ? "generated" : "added"}
                {isReady ? " • Ready to create" : " • Add title to continue"}
              </>
            ) : (
              "Generate slides with AI or add manually"
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

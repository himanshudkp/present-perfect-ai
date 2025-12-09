import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface CreatePresentationFooterProps {
  isVisible: boolean;
  isReady: boolean;
  isCreating: boolean;
  cardCount: number;
  presentationTitle: string;
  onCreateClick: () => void;
}

export const CreatePresentationFooter = ({
  isVisible,
  isReady,
  isCreating,
  cardCount,
  presentationTitle,
  onCreateClick,
}: CreatePresentationFooterProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-background via-background to-transparent pt-6 pb-4 px-4 sm:px-6 lg:px-8 z-40 border-t"
        >
          <div className="max-w-7xl mx-auto">
            <Button
              onClick={onCreateClick}
              disabled={!isReady || isCreating}
              className={cn(
                "w-full font-semibold text-base gap-2",
                "bg-linear-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90",
                "transition-all duration-200 shadow-lg hover:shadow-xl",
                "h-12 sm:h-14"
              )}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Presentation...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Create Presentation
                  {!isReady &&
                    (!presentationTitle.trim()
                      ? " (Add title first)"
                      : " (Add slides)")}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

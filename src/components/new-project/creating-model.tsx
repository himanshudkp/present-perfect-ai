import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface CreatingModalProps {
  isCreating: boolean;
  presentationTitle: string;
  cardCount: number;
}

export const CreatingModal = ({
  isCreating,
  presentationTitle,
  cardCount,
}: CreatingModalProps) => {
  return (
    <AnimatePresence>
      {isCreating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card p-8 rounded-xl shadow-2xl border text-center max-w-md"
          >
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">
              Creating Your Presentation
            </h3>
            <p className="text-sm text-muted-foreground">
              "{presentationTitle}"
              <br />
              Setting up {cardCount} slide{cardCount !== 1 ? "s" : ""}...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

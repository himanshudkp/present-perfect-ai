import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ResetConfig {
  outlines: any[];
  presentationTitle: string;
  currentAIPrompt?: string;
  manualSlideTitle?: string;
}

interface ResetCallbacks {
  onReset: () => void;
  onBeforeConfirm?: () => void;
}

export const useResetState = (
  config: ResetConfig,
  callbacks: ResetCallbacks
) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const resetCards = useCallback(() => {
    const hasData =
      config.outlines.length > 0 ||
      config.presentationTitle.trim() ||
      config.currentAIPrompt?.trim() ||
      false ||
      config.manualSlideTitle?.trim() ||
      false;

    if (showResetConfirm) {
      callbacks.onBeforeConfirm?.();
      callbacks.onReset();
      setShowResetConfirm(false);
      toast.success("All data cleared");
    } else {
      if (hasData) {
        setShowResetConfirm(true);
        setTimeout(() => setShowResetConfirm(false), 3000);
      }
    }
  }, [config, showResetConfirm, callbacks]);

  return { resetCards, showResetConfirm, setShowResetConfirm };
};

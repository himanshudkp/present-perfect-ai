import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProject } from "@/actions/project";
import { useSlideStore } from "@/store/use-slide-store";
import { OutlineCard } from "@/lib/types";

interface UseCreatePresentationProps {
  outlines: OutlineCard[];
  presentationTitle: string;
  resetOutlines: () => void;
  onSuccess?: () => void;
}

export const useCreatePresentation = ({
  outlines,
  presentationTitle,
  resetOutlines,
  onSuccess,
}: UseCreatePresentationProps) => {
  const router = useRouter();
  const { setProject } = useSlideStore();
  const [isCreating, setIsCreating] = useState(false);

  const isReady = outlines.length > 0;

  const handleCreatePresentation = useCallback(async () => {
    if (!isReady) {
      if (!presentationTitle.trim()) {
        toast.error("Please enter a presentation title");
        return;
      }
      if (outlines.length === 0) {
        toast.error("Please generate or add slides");
        return;
      }
      return;
    }

    setIsCreating(true);

    try {
      const res = await createProject(presentationTitle.trim(), outlines);

      if (res.status !== 200 || !res.data) {
        toast.error("Failed to create presentation", {
          description: res.error || "Please try again",
        });
        return;
      }

      setProject(res.data);
      resetOutlines();

      toast.success("Presentation created!", {
        description: "Redirecting to theme selection...",
      });

      router.push(`/presentation/${res.data.id}/select-theme`);
      onSuccess?.();
    } catch (error) {
      console.error("Creation error:", error);
      toast.error("Failed to create presentation", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsCreating(false);
    }
  }, [
    isReady,
    outlines,
    presentationTitle,
    router,
    setProject,
    resetOutlines,
    onSuccess,
  ]);

  return { handleCreatePresentation, isCreating, isReady };
};

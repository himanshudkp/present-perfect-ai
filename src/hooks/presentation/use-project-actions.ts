import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  deleteProject,
  recoverProject,
  updateFavorite,
} from "@/actions/project";
import { showError, showSuccess } from "@/components/toast-message";

interface ActionResponse {
  status: number;
  error?: string;
  data?: unknown;
}

export const useProjectActions = () => {
  const router = useRouter();

  const executeAction = useCallback(
    async (
      id: string,
      action: "delete" | "recover" | "favorite"
    ): Promise<void> => {
      try {
        let response: ActionResponse;

        switch (action) {
          case "delete":
            response = await deleteProject(id);
            break;
          case "recover":
            response = await recoverProject(id);
            break;
          case "favorite":
            response = await updateFavorite(id);
            break;
        }

        if (response?.status !== 200) {
          showError(
            `Failed to ${action}`,
            response?.error || "Something went wrong"
          );
          return;
        }

        router.refresh();

        const messages: Record<string, string> = {
          recover: "Project recovered",
          delete: "Moved to trash",
          favorite: "Favorite status updated",
        };

        showSuccess(
          messages[action],
          action === "recover"
            ? "Your project has been restored"
            : action === "delete"
            ? "You can recover it from trash"
            : ""
        );
      } catch (error) {
        console.error(`Error during ${action}:`, error);
        showError("Something went wrong", "Please try again");
      }
    },
    [router]
  );

  return { executeAction };
};

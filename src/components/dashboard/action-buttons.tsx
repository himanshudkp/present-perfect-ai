import { memo } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, Eye, RotateCcw, Star, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import IconButton from "./icon-button";

const HOVER_OVERLAY_VARIANTS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
} as const;

interface ActionButtonsProps {
  isDeleted: boolean;
  isHovered: boolean;
  isFavorite: boolean;
  loading: boolean;
  onFavorite: () => void;
  onCopyLink: () => void;
  onNavigate: () => void;
  onExport: () => void;
  onDelete: () => void;
  onRecover: () => void;
}

const ActionButtons = ({
  isDeleted,
  isHovered,
  isFavorite,
  loading,
  onFavorite,
  onCopyLink,
  onNavigate,
  onExport,
  onDelete,
  onRecover,
}: ActionButtonsProps) => {
  if (isDeleted) {
    return (
      <ConfirmDialog
        trigger={
          <Button size="sm" variant="outline" className="gap-1.5 w-full">
            <RotateCcw className="w-4 h-4" />
            Recover
          </Button>
        }
        title="Recover Project?"
        description="This will recover your project and restore all your data."
        confirmLabel="Recover"
        variant="recover"
        isLoading={loading}
        onConfirm={onRecover}
      />
    );
  }

  return (
    <>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            {...HOVER_OVERLAY_VARIANTS}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1"
          >
            <IconButton
              icon={Star}
              label={isFavorite ? "Unfavorite" : "Favorite"}
              isFilled={isFavorite}
              onClick={onFavorite}
            />
            <IconButton icon={Copy} label="Copy Link" onClick={onCopyLink} />
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="sm"
        onClick={onNavigate}
        className="flex-1 gap-1.5 font-medium"
      >
        <Eye className="w-3.5 h-3.5" />
        Open
      </Button>
      <Button
        size="sm"
        onClick={onExport}
        className="flex-1 gap-1.5 font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
      >
        <Download className="w-3.5 h-3.5" />
        Export
      </Button>

      <ConfirmDialog
        trigger={
          <Button variant="destructive" size="sm" className="w-9 p-0">
            <Trash2 className="w-4 h-4" />
          </Button>
        }
        title="Delete Project?"
        description="This will move your project to trash. You can recover it later."
        confirmLabel="Delete"
        variant="delete"
        isLoading={loading}
        onConfirm={onDelete}
      />
    </>
  );
};

export default memo(ActionButtons);

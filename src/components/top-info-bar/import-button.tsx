"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { showError, showSuccess } from "@/components/toast-message";
import { memo, useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

const MOTION_ANIMATE = { rotate: 360 } as const;
const MOTION_TRANSITION = {
  duration: 1,
  repeat: Infinity,
  ease: "linear",
} as const;

const ACCEPTED_FILE_TYPES = ".pptx,.ppt,.pdf,.key";
const IMPORT_SIMULATION_DELAY = 2000;

const LoadingSpinner = memo(() => (
  <motion.div animate={MOTION_ANIMATE} transition={MOTION_TRANSITION}>
    <Upload className="h-4 w-4" />
  </motion.div>
));

const ImportButton = () => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = useCallback(async () => {
    setIsImporting(true);

    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ACCEPTED_FILE_TYPES;

      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          setIsImporting(false);
          return;
        }

        try {
          // TODO: Implement actual import logic
          console.log("Importing file:", file.name);

          showSuccess(
            "Import started",
            `Processing ${file.name}... This may take a moment.`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, IMPORT_SIMULATION_DELAY)
          );

          showSuccess(
            "Import successful",
            "Your presentation has been imported"
          );
        } catch (error) {
          console.error("File processing failed:", error);
          showError("Processing failed", "Unable to process file");
        } finally {
          setIsImporting(false);
        }
      };

      input.oncancel = () => setIsImporting(false);

      input.click();
    } catch (error) {
      console.error("Import failed:", error);
      showError("Import failed", "Please try again");
      setIsImporting(false);
    }
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={handleImport}
            disabled={isImporting}
            className="gap-2 font-medium transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Import presentation"
          >
            {isImporting ? <LoadingSpinner /> : <Upload className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {isImporting ? "Importing..." : "Import"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Import presentation (.pptx, .pdf, .key)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(ImportButton);

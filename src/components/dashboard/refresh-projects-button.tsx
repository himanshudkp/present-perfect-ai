import { memo } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";

interface RefreshProjectsButtonProps {
  showSkeleton: boolean;
  setShowSkeleton: (v: boolean) => void;
}

const RefreshProjectsButton = ({
  showSkeleton,
  setShowSkeleton,
}: RefreshProjectsButtonProps) => {
  const router = useRouter();

  const handleRefresh = () => {
    setShowSkeleton(true);
    router.refresh();
    setTimeout(() => setShowSkeleton(false), 300);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-9 w-9 p-0"
          >
            {showSkeleton ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>

        <TooltipContent>Refresh</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(RefreshProjectsButton);

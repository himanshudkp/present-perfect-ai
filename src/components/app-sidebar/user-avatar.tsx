import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/utils";
import { UserButton } from "@clerk/nextjs";
import { Crown } from "lucide-react";
import { memo } from "react";

const COLLAPSED_AVATAR_APPEARANCE = {
  elements: { avatarBox: "h-10 w-10" },
} as const;

const TOOLTIP_DELAY = 200;

interface UserAvatar {
  userName: string;
  userEmail: string;
  isPremium: boolean;
}

const UserAvatar = ({ isPremium, userEmail, userName }: UserAvatar) => {
  return (
    <TooltipProvider delayDuration={TOOLTIP_DELAY}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative",
              isPremium &&
                "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full"
            )}
          >
            <UserButton appearance={COLLAPSED_AVATAR_APPEARANCE} />
            {isPremium && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                <Crown className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold flex items-center gap-2">
              {userName}
              {isPremium && <Crown className="h-3 w-3 text-primary" />}
            </p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
            {isPremium && (
              <p className="text-xs text-primary font-medium">Premium Member</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(UserAvatar);

"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/generated/prisma/client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { Sparkles, ChevronRight, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  dbUser: User;
  userInitials?: string;
};

const NavFooter = ({ dbUser, userInitials }: Props) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { open: sidebarOpen } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const userEmail = useMemo(() => {
    return user?.emailAddresses?.[0]?.emailAddress || "";
  }, [user?.emailAddresses]);

  const handleSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Implement subscription logic
      console.log("Redirecting to subscription...");
      // router.push("/pricing");
    } catch (error) {
      console.error("Failed to upgrade subscription:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* Expanded View */}
        {sidebarOpen ? (
          <div className="flex flex-col gap-4 items-start">
            {/* Upgrade Card - Only when not subscribed */}
            {!dbUser?.subscription && (
              <div
                className={cn(
                  "w-full flex flex-col gap-3 p-4 rounded-lg",
                  "bg-gradient-to-br from-primary/10 to-primary/5",
                  "border border-primary/20 hover:border-primary/40 transition-colors duration-200"
                )}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-sm font-semibold text-primary">
                      Unlock Creative AI
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Get access to AI-powered features and more
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleSubscription}
                  disabled={isLoading}
                  className={cn(
                    "w-full font-semibold transition-all duration-200",
                    "bg-primary hover:bg-primary/90 text-primary-foreground"
                  )}
                  size="sm"
                  aria-label="Upgrade to premium"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Upgrading...
                    </>
                  ) : (
                    <>
                      Upgrade
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* User Profile Section */}
            <SignedIn>
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "w-full transition-all duration-200",
                  "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                  "hover:bg-accent"
                )}
                tooltip={`${user?.fullName} • ${userEmail}`}
              >
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-semibold">
                    {user?.fullName || "User"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </SidebarMenuButton>
            </SignedIn>
          </div>
        ) : (
          /* Collapsed View - Only User Avatar */
          <div className="flex flex-col gap-2 items-center w-full">
            {/* Upgrade Badge - Small indicator when collapsed and not subscribed */}
            {!dbUser?.subscription && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSubscription}
                      disabled={isLoading}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-10 w-10 p-0 rounded-full relative",
                        "bg-gradient-to-br from-primary/20 to-primary/10",
                        "hover:from-primary/30 hover:to-primary/20",
                        "border border-primary/30",
                        "transition-all duration-200"
                      )}
                      aria-label="Upgrade to premium"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-primary" />
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-[8px] text-primary-foreground font-bold">
                              !
                            </span>
                          </div>
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">
                        Upgrade to Premium
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Unlock AI-powered features and more
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* User Avatar - With Tooltip */}
            <SignedIn>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "relative",
                        dbUser?.subscription &&
                          "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full"
                      )}
                    >
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "h-10 w-10",
                          },
                        }}
                      />
                      {/* Premium Badge */}
                      {dbUser?.subscription && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                          <Crown className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold flex items-center gap-2">
                        {user?.fullName || "User"}
                        {dbUser?.subscription && (
                          <Crown className="h-3 w-3 text-primary inline" />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userEmail}
                      </p>
                      {dbUser?.subscription && (
                        <p className="text-xs text-primary font-medium">
                          Premium Member
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SignedIn>
          </div>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavFooter;

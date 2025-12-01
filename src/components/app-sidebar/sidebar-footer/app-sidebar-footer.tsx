"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/generated/prisma/client";
import { SignedIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState, memo } from "react";
import UserProfile from "./user-profile/user-profile";
import UserAvatar from "./user-profile/user-avatar";
import UpgradeCard from "./subscription/upgrade-card";

interface Props {
  dbUser: User;
}

const AppSidebarFooter = ({ dbUser }: Props) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { open: sidebarOpen } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const userEmail = useMemo(
    () => user?.emailAddresses?.[0]?.emailAddress || "",
    [user?.emailAddresses]
  );

  const userName = useMemo(() => user?.fullName || "User", [user?.fullName]);

  const isPremium = useMemo(
    () => Boolean(dbUser?.subscription),
    [dbUser?.subscription]
  );

  const showUpgrade = useMemo(() => !isPremium, [isPremium]);

  const handleSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Implement subscription logic
      console.log("Redirecting to subscription...");
      router.push("/subscription");
    } catch (error) {
      console.error("Failed to upgrade subscription:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {sidebarOpen ? (
          <div className="flex flex-col gap-4 items-start">
            {showUpgrade && (
              <UpgradeCard
                isLoading={isLoading}
                onUpgrade={handleSubscription}
              />
            )}
            <SignedIn>
              <UserProfile userName={userName} userEmail={userEmail} />
            </SignedIn>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center w-full">
            <SignedIn>
              <UserAvatar
                userName={userName}
                userEmail={userEmail}
                isPremium={isPremium}
              />
            </SignedIn>
          </div>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default memo(AppSidebarFooter);

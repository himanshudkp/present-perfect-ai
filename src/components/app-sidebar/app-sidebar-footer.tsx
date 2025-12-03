"use client";

import { memo, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, useUser } from "@clerk/nextjs";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import UserProfile from "./user-profile";
import UserAvatar from "./user-avatar";
import UpgradeCard from "./upgrade-card";
import type { User } from "@/generated/prisma/client";

const AppSidebarFooter = ({ dbUser }: { dbUser: User }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { open: sidebarOpen } = useSidebar();
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
    router.push("/subscription");
  }, [router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {sidebarOpen ? (
          <div className="flex flex-col gap-4 items-start">
            {showUpgrade && <UpgradeCard onUpgrade={handleSubscription} />}
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

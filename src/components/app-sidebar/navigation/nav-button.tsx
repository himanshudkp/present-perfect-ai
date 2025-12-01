"use client";

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/utils";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
} as const;

const TRANSITION_VARIANTS = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

interface NavButtonProps {
  title: string;
  url: string;
  icon: LucideIcon;
}

function NavButton({ title, url, icon: Icon }: NavButtonProps) {
  const pathname = usePathname();

  const isActive = useMemo(() => pathname.startsWith(url), [pathname, url]);

  const buttonClass = useMemo(
    () =>
      cn(
        "transition-all duration-200 relative group hover:translate-x-1",
        isActive && [
          "bg-primary/10 text-primary font-semibold",
          "before:absolute before:left-0 before:top-0 before:bottom-0",
          "before:w-1 before:bg-primary before:rounded-r-full",
        ],
        !isActive && "hover:bg-accent/50"
      ),
    [isActive]
  );

  const iconClass = useMemo(
    () =>
      cn(
        "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
        isActive
          ? "text-primary"
          : "text-muted-foreground group-hover:text-foreground"
      ),
    [isActive]
  );

  return (
    <motion.div variants={ITEM_VARIANTS}>
      <SidebarMenuItem>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton
                tooltip={title}
                isActive={isActive}
                className={buttonClass}
              >
                <Link
                  href={url}
                  className="flex items-center gap-3 no-underline w-full"
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={iconClass} />

                  <span className="truncate text-sm font-medium leading-tight flex-1">
                    {title}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="h-2 w-2 rounded-full bg-primary shrink-0"
                      transition={TRANSITION_VARIANTS}
                    />
                  )}
                </Link>
              </SidebarMenuButton>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      </SidebarMenuItem>
    </motion.div>
  );
}

export default memo(NavButton);

"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavItemChild = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavItemChild[];
  badge?: string | number;
  isNew?: boolean;
  comingSoon?: boolean;
  color?: string;
};

type Props = {
  items: NavItem[];
  showLabel?: boolean;
  compact?: boolean;
};

const NavigationContainer = ({
  items,
  showLabel = true,
  compact = false,
}: Props) => {
  const pathname = usePathname();

  const activeItem = useMemo(() => {
    return items.find((item) => pathname.startsWith(item.url));
  }, [pathname, items]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <SidebarGroup className="p-0">
      {showLabel && (
        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3 mb-2">
          Navigation
        </SidebarGroupLabel>
      )}

      <SidebarMenu className="gap-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {items.map((item, index) => {
            const {
              icon: Icon,
              title,
              url,
              badge,
              isNew,
              comingSoon,
              color,
            } = item;
            const isActive = pathname.startsWith(url);

            return (
              <motion.div key={title} variants={itemVariants}>
                <SidebarMenuItem>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild={!comingSoon}
                          tooltip={title}
                          isActive={isActive}
                          className={cn(
                            "transition-all duration-200 relative group",
                            "hover:translate-x-1",
                            isActive && [
                              "bg-primary/10 text-primary font-semibold",
                              "before:absolute before:left-0 before:top-0 before:bottom-0",
                              "before:w-1 before:bg-primary before:rounded-r-full",
                            ],
                            !isActive && "hover:bg-accent/50",
                            comingSoon && "opacity-60 cursor-not-allowed"
                          )}
                          disabled={comingSoon}
                        >
                          {comingSoon ? (
                            <div className="flex items-center gap-3 w-full">
                              <Icon
                                className={cn(
                                  "h-5 w-5 shrink-0 transition-transform",
                                  "group-hover:scale-110",
                                  color || "text-muted-foreground"
                                )}
                              />
                              <span className="truncate text-sm font-medium leading-tight flex-1">
                                {title}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                Soon
                              </Badge>
                            </div>
                          ) : (
                            <Link
                              href={url}
                              className="flex items-center gap-3 no-underline w-full"
                              aria-current={isActive ? "page" : undefined}
                            >
                              <Icon
                                className={cn(
                                  "h-5 w-5 shrink-0 transition-transform",
                                  "group-hover:scale-110",
                                  isActive && "text-primary",
                                  !isActive &&
                                    "text-muted-foreground group-hover:text-foreground",
                                  color
                                )}
                              />
                              <span className="truncate text-sm font-medium leading-tight flex-1">
                                {title}
                              </span>

                              {/* Badges and indicators */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isNew && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30"
                                  >
                                    New
                                  </Badge>
                                )}

                                {badge && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0 min-w-[20px] justify-center"
                                  >
                                    {badge}
                                  </Badge>
                                )}

                                {isActive && (
                                  <motion.div
                                    layoutId="activeIndicator"
                                    className="h-2 w-2 rounded-full bg-primary"
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 30,
                                    }}
                                  />
                                )}
                              </div>
                            </Link>
                          )}
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {comingSoon && (
                        <TooltipContent side="right">
                          <p>Coming Soon! 🚀</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              </motion.div>
            );
          })}
        </motion.div>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavigationContainer;

"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";
import NavButton from "./navigation-button";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

function NavigationContainer({ items }: { items: NavItem[] }) {
  const navItems = useMemo(() => items, [items]);

  return (
    <SidebarGroup className="p-0 group-data-[state=collapsed]:pt-5">
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-3 mb-2">
        Navigation
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1">
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {navItems.map((item) => (
            <NavButton
              key={item.url}
              icon={item.icon}
              title={item.title}
              url={item.url}
            />
          ))}
        </motion.div>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default memo(NavigationContainer);

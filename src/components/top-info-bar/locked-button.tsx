"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { memo } from "react";

interface LockedButtonProps {
  isHovering: boolean;
  onClick: () => void;
}
const LockedButton = ({ isHovering, onClick }: LockedButtonProps) => (
  <Button
    size="lg"
    onClick={onClick}
    variant="outline"
    className="rounded-xl font-semibold gap-2 relative overflow-hidden group border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
    aria-label="Create new project (Premium required)"
  >
    <motion.div
      className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-primary/10"
      animate={{ x: isHovering ? ["-100%", "100%"] : "-100%" }}
      transition={{
        duration: 1.5,
        repeat: isHovering ? Infinity : 0,
        ease: "linear",
      }}
    />

    <motion.div
      className="flex items-center gap-2 relative z-10"
      animate={{ x: isHovering ? [0, 2, 0] : 0 }}
      transition={{
        duration: 0.3,
        repeat: isHovering ? Infinity : 0,
        repeatDelay: 0.5,
      }}
    >
      <Lock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
        Create With AI
      </span>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="absolute -top-1 -right-1 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
    >
      PRO
    </motion.div>
  </Button>
);

export default memo(LockedButton);

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Plus, Sparkles } from "lucide-react";
import { cn } from "@/utils";

type Props = {
  onAddCard: () => void;
  label?: string;
  showLabel?: boolean;
  variant?: "default" | "minimal" | "fancy";
  disabled?: boolean;
  className?: string;
};

const AddCardButton = ({
  onAddCard,
  label = "Add card",
  showLabel = true,
  variant = "default",
  disabled = false,
  className,
}: Props) => {
  const [showGap, setShowGap] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsPressed(true);
      onAddCard();
      setTimeout(() => setIsPressed(false), 200);
    }
  };

  const variants = {
    default: {
      lineWidth: "40%",
      buttonSize: "h-8 w-8",
      iconSize: "h-4 w-4",
      hoverHeight: "2rem",
    },
    minimal: {
      lineWidth: "30%",
      buttonSize: "h-7 w-7",
      iconSize: "h-3.5 w-3.5",
      hoverHeight: "1.75rem",
    },
    fancy: {
      lineWidth: "45%",
      buttonSize: "h-9 w-9",
      iconSize: "h-4 w-4",
      hoverHeight: "2.5rem",
    },
  };

  const config = variants[variant];

  return (
    <motion.div
      className={cn(
        "w-full relative overflow-visible group",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      initial={{
        height: "0.5rem",
      }}
      animate={{
        height: showGap ? config.hoverHeight : "0.5rem",
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      onHoverStart={() => !disabled && setShowGap(true)}
      onHoverEnd={() => setShowGap(false)}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0.2 }}
        animate={{
          opacity: showGap ? 0 : 0.2,
          transition: { duration: 0.2 },
        }}
      >
        <div className="w-full h-px bg-border/50" />
      </motion.div>

      <AnimatePresence>
        {showGap && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="absolute inset-0 flex items-center justify-center gap-2"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="origin-right"
              style={{ width: config.lineWidth }}
            >
              <div className="h-px bg-linear-to-r from-transparent via-primary to-primary" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: isPressed ? 0.85 : 1,
                rotate: 0,
              }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                disabled={disabled}
                aria-label={label}
                className={cn(
                  "rounded-full p-0 bg-primary hover:bg-primary/90 border-primary hover:border-primary/90 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group/btn",
                  config.buttonSize
                )}
              >
                {variant === "fancy" && (
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                )}

                <Plus
                  className={cn(
                    "text-primary-foreground transition-transform group-hover/btn:rotate-90",
                    config.iconSize
                  )}
                />
              </Button>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="origin-left"
              style={{ width: config.lineWidth }}
            >
              <div className="h-px bg-linear-to-l from-transparent via-primary to-primary" />
            </motion.div>

            {showLabel && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-xs text-muted-foreground whitespace-nowrap bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border shadow-sm"
              >
                {label}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {variant === "fancy" && showGap && (
        <motion.div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                x: [0, (i - 1) * 20],
                y: [0, -10 - i * 5],
              }}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            >
              <Sparkles className="h-3 w-3 text-primary" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AddCardButton;

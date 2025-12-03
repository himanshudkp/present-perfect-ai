"use client";

import { useEffect, useState, useRef, memo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_STATE = {
  PARENT: { scaleX: 0, opacity: 1 },
  CHILD: { x: "-100%" },
} as const;

const ANIMATE_STATE = {
  PARENT: {
    scaleX: 1,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  CHILD: { x: "100%" },
} as const;

const EXIT_STATE = {
  PARENT: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
  CHILD: {},
} as const;

const TRANSITION = {
  PARENT: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
  CHILD: {
    duration: 0.8,
    ease: "easeInOut",
  },
} as const;

const RouteTransition = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsLoading(true);

    timerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key={pathname}
          className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left"
          initial={INITIAL_STATE.PARENT}
          animate={ANIMATE_STATE.PARENT}
          exit={EXIT_STATE.PARENT}
        >
          <div className="h-full w-full bg-linear-to-r from-primary via-primary/90 to-primary" />

          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
            initial={INITIAL_STATE.CHILD}
            animate={ANIMATE_STATE.CHILD}
            transition={TRANSITION.CHILD}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default memo(RouteTransition);

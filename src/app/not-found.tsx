"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function PageNotFound() {
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="max-w-3xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <motion.div
            className="relative h-24 w-24 flex items-center justify-center"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <FileQuestion className="h-12 w-12 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-6">
          <motion.h1
            className="text-8xl sm:text-9xl font-bold text-primary/20"
            animate={{
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            404
          </motion.h1>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Don't
            worry, let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
        >
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              className={cn(
                "w-full gap-2 rounded-lg font-semibold",
                "bg-primary hover:bg-primary/90",
                "transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
              )}
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            onClick={handleGoBack}
            className="w-full sm:w-auto gap-2 rounded-lg font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            If you believe this is a mistake, please{" "}
            <Link href="/support" className="text-primary hover:underline">
              contact support
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

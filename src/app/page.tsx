"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-lg overflow-hidden bg-linear-to-br from-primary to-primary/70 flex items-center justify-center">
                <Avatar className="h-full w-full rounded-lg">
                  <AvatarImage
                    src="/logo.png"
                    alt="PresentPerfect Logo"
                    loading="lazy"
                  />
                  <AvatarFallback className="rounded-lg bg-transparent text-primary-foreground font-bold">
                    PP
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col items-start">
                <span className="truncate text-primary text-xl font-bold">
                  PresentPerfect
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  AI-Powered Presentations
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a href="/sign-in">
                <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                  Sign In
                </button>
              </a>
              <a href="/sign-up">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <motion.section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Presentation Builder</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent"
          >
            Create Stunning
            <br />
            Presentations in Seconds
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Let AI do the heavy lifting. Generate professional presentations
            with just a few words, or build from scratch with full control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/sign-up">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all shadow-2xl hover:shadow-primary/50 flex items-center gap-2">
                Start Creating Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;

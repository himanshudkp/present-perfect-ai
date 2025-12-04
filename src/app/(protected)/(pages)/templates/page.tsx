"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutTemplate, Construction } from "lucide-react";

const TemplatesPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
          <LayoutTemplate className="w-10 h-10 text-primary animate-pulse" />
        </div>

        <h1 className="text-4xl font-bold">Templates</h1>

        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          A library of beautifully designed templates will be available here.
          This page is currently under construction.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">
          <Construction className="w-4 h-4" />
          Coming Soon
        </div>
      </motion.div>
    </div>
  );
};

export default TemplatesPage;

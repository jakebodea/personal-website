"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HeroSection(): React.ReactNode {
  return (
    <motion.div
      className="mb-16"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <motion.div
          className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
          Always open to new opportunities :)
        </motion.div>
        <motion.h1
          className="text-4xl md:text-6xl font-serif font-light leading-tight text-foreground mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          I&apos;m Jake, a mathematician turned{" "}
          <span className="text-primary font-medium italic relative">ML Engineer </span>
          and
          <span className="text-primary font-medium italic relative"> Full Stack Developer </span>
          with a keen eye for
          <span className="text-primary font-medium italic relative"> design</span>.
        </motion.h1>
        <motion.p
          className="text-xl text-muted-foreground font-light leading-relaxed max-w-3xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Building cool stuff that both look good and solve real problems, from algorithms to web & iOS apps... and some totally unnecessary but fun side projects too! */}
          {"Build fast, ship fast, and fix fast, but it has to look good throughout. Optimizing every element from the user's perspective, be it frontend interfaces, backends, or machine learning models, is key to an end product that's actually useful."}
        </motion.p>
      </div>
    </motion.div>
  );
} 
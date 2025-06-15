"use client";

import React from "react";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import CtaSection from "./components/CtaSection";

export default function HomePage(): React.ReactNode {
  return (
    <div className="min-h-full">
      <div className="container max-w-4xl mx-auto px-6 py-8">
        <HeroSection />

        {/* Main Content Grid */}
        <div className="grid gap-8 md:gap-12">
          <AboutSection />
          {/* <InfoGrid /> */}
          <CtaSection />
        </div>
      </div>
    </div>
  );
}
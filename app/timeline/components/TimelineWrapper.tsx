"use client";

import React from "react";
import Timeline from "./Timeline";
import { timelineItems } from "@/content/timeline-data";
import TimelineHeader from "./TimelineHeader";
import { useIsMobile } from "@/hooks/use-mobile";

export default function TimelineWrapper(): React.ReactNode {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-full">
      <div className={`container max-w-4xl mx-auto ${isMobile ? 'px-3 py-4 max-w-full overflow-x-hidden' : 'px-6 py-8'}`}>
        {/* Header Section */}
        <TimelineHeader />

        {/* Timeline Content */}
        <div className={isMobile ? 'px-1 py-4' : 'p-8'}>
          <div className="scrollbar-thin">
            <Timeline items={timelineItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

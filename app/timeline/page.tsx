import React from "react";
import Timeline from "@/app/timeline/components/Timeline";
import { timelineItems } from "@/content/timeline-data";
import TimelineHeader from "./components/TimelineHeader";

export const metadata = {
  title: 'Timeline',
  description: 'Jake Bodea\'s timeline of experiences'
}

export default function TimelinePage(): React.ReactNode {
  return (
    <div className="min-h-full">
      <div className="container max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <TimelineHeader />

        {/* Timeline Content */}
        <div className="p-8">
          <div className="scrollbar-thin">
            <Timeline items={timelineItems} />
          </div>
        </div>
      </div>
    </div>
  )
}

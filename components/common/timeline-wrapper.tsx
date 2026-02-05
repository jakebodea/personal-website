"use client";

import React from "react";
import { Timeline } from "./timeline";
import { timelineItems } from "@/content/timeline-data";
import { PageWrapper } from "@/components/layout/page-wrapper";

export function TimelineWrapper(): React.ReactNode {
  return (
    <PageWrapper title="timeline" subtitle="a chronological journey through my career experiences.">
      <Timeline items={timelineItems} />
    </PageWrapper>
  );
}

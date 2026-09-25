"use client";

import type { ReactNode } from "react";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { timelineItems } from "@/content/timeline-data";

import { Timeline } from "./timeline";

export const TimelineWrapper = (): ReactNode => (
  <PageWrapper
    title="timeline"
    subtitle="A chronological journey through my career experiences."
  >
    <Timeline items={timelineItems} />
  </PageWrapper>
);

'use client'

import { PageTitle } from '@/components/layout/page-title';

const TimelineHeader = () => (
  <div className="mb-12">
    <PageTitle className="text-4xl md:text-5xl font-serif text-foreground mb-4">
      timeline
    </PageTitle>
    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
      a chronological journey through my career experiences.
    </p>
  </div>
);

export { TimelineHeader }; 
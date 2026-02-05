'use client'

import { PageTitle } from '@/components/layout/page-title';

const ProjectHeader = () => (
  <div className="mb-12">
    <PageTitle className="text-4xl md:text-5xl font-serif text-foreground mb-4">
      projects
    </PageTitle>
    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
      a showcase of my technical work.
    </p>
  </div>
);

export { ProjectHeader }; 
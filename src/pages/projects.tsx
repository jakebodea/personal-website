import type React from "react";

import { GithubContributions } from "@/components/common/github-calendar";
import { ProjectList } from "@/components/common/project-list";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Separator } from "@/components/ui/separator";
import { projects } from "@/content/projects-data";

const ProjectsPage = (): React.ReactNode => (
  <PageWrapper title="projects" subtitle="A showcase of my technical work.">
    <div className="space-y-8">
      <Separator />
      <GithubContributions />
      <Separator />
      <ProjectList projects={projects} />
      <p className="text-center text-sm text-muted-foreground">and more...</p>
    </div>
  </PageWrapper>
);

export default ProjectsPage;

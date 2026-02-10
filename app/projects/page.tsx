import { ProjectList } from "@/components/common/project-list";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { projects } from "@/content/projects-data";

export const metadata = {
  title: 'projects',
  description: 'jake bodea\'s projects'
}

export default function ProjectsPage(): React.ReactNode {
  return (
    <PageWrapper title="projects" subtitle="a showcase of my technical work.">
      <ProjectList projects={projects} />
    </PageWrapper>
  )
}

import { GithubContributions } from "@/components/common/github-calendar";
import { ProjectList } from "@/components/common/project-list";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Separator } from "@/components/ui/separator";
import { projects } from "@/content/projects-data";

export const metadata = {
  title: 'projects',
  description: 'jake bodea\'s projects'
}

export default function ProjectsPage(): React.ReactNode {
  return (
    <PageWrapper title="projects" subtitle="a showcase of my technical work.">
      <div className="space-y-8">
        <Separator />
        <GithubContributions />
        <Separator />
        <ProjectList projects={projects} />
      </div>
    </PageWrapper>
  )
}

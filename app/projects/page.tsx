import { ComingSoon } from "@/components/common/coming-soon";
import { PageWrapper } from "@/components/layout/page-wrapper";

export const metadata = {
  title: 'projects',
  description: 'jake bodea\'s projects'
}

export default function ProjectsPage(): React.ReactNode {
  return (
    <PageWrapper title="projects" subtitle="a showcase of my technical work.">
      <ComingSoon />
    </PageWrapper>
  )
}

import { ComingSoon } from "@/components/common/coming-soon";
import { ProjectHeader } from "@/components/common/project-header";

export const metadata = {
  title: 'projects',
  description: 'jake bodea\'s projects'
}

export default function ProjectsPage(): React.ReactNode {
  return (
    <div className="min-h-full">
      <div className="container max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <ProjectHeader />

        {/* Coming Soon Content */}
        <ComingSoon />
      </div>
    </div>
  )
}

import ComingSoon from "./components/ComingSoon";
import ProjectHeader from "./components/ProjectHeader";

export const metadata = {
  title: 'Projects',
  description: 'Jake Bodea\'s projects'
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

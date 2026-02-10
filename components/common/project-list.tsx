import { ProjectCard } from '@/components/common/project-card'
import type { ProjectData } from '@/content/projects-data'

interface ProjectListProps {
  projects: ProjectData[]
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="space-y-8">
      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  )
}

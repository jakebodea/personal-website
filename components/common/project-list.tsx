import { ProjectCard } from "@/components/common/project-card";
import type { ProjectData } from "@/content/projects-data";

interface ProjectListProps {
  projects: ProjectData[];
}

export const ProjectList = ({ projects }: ProjectListProps) => (
  <div className="space-y-8">
    {projects.map((project) => (
      <ProjectCard key={project.title} project={project} />
    ))}
  </div>
);

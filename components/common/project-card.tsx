import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProjectGallery } from '@/components/common/project-gallery'
import { XEmbed } from '@/components/common/x-embed'
import type { ProjectData } from '@/content/projects-data'

interface ProjectCardProps {
  project: ProjectData
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-serif text-foreground">{project.title}</h2>

        <p className="text-sm text-muted-foreground">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          {project.liveUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink />
                Live site
              </a>
            </Button>
          )}
          {project.repoUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
                Source
              </a>
            </Button>
          )}
        </div>

        {project.media?.type === 'x-embed' && (
          <XEmbed url={project.media.url} />
        )}

        {project.media?.type === 'image' && (
          <figure className="mt-4 overflow-hidden rounded-lg border border-border">
            <Image
              src={project.media.url}
              alt={project.media.alt ?? project.title}
              width={1200}
              height={675}
              className="h-auto w-full"
            />
          </figure>
        )}

        {project.media?.type === 'gallery' && (
          <ProjectGallery images={project.media.images} />
        )}
      </CardContent>
    </Card>
  )
}

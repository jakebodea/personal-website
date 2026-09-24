import { ExternalLink, MousePointer2 } from "lucide-react";
import type { SVGProps } from "react";

import { ProjectGallery } from "@/components/common/project-gallery";
import Image from "@/components/common/site-image";
import { XEmbed } from "@/components/common/x-embed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProjectData } from "@/content/projects-data";

interface ProjectCardProps {
  project: ProjectData;
}

const hasNonEmptyUrl = (url: string | undefined): url is string =>
  url !== undefined && url !== "";

const GitHubMark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ProjectCard = ({ project }: ProjectCardProps) => (
  <Card>
    <CardContent className="space-y-4 p-6">
      <h2 className="font-serif text-2xl text-foreground">{project.title}</h2>

      <p className="text-sm text-muted-foreground">{project.description}</p>

      <div className="flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <Badge key={tech} variant="secondary">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {hasNonEmptyUrl(project.demoUrl) ? (
          <Button variant="outline" size="sm" asChild>
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <MousePointer2 data-icon="inline-start" />
              Try live demo
            </a>
          </Button>
        ) : null}
        {hasNonEmptyUrl(project.liveUrl) ? (
          <Button variant="ghost" size="sm" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink data-icon="inline-start" />
              {hasNonEmptyUrl(project.demoUrl) ? "Product site" : "Live site"}
            </a>
          </Button>
        ) : null}
        {hasNonEmptyUrl(project.repoUrl) ? (
          <Button variant="ghost" size="sm" asChild>
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <GitHubMark className="size-4" data-icon="inline-start" />
              GitHub repo
            </a>
          </Button>
        ) : null}
      </div>

      {hasNonEmptyUrl(project.demoNote) ? (
        <p className="text-xs text-muted-foreground">{project.demoNote}</p>
      ) : null}

      {project.media?.type === "x-embed" ? (
        <XEmbed url={project.media.url} />
      ) : null}

      {project.media?.type === "image" ? (
        <figure className="mt-4 overflow-hidden rounded-lg border border-border">
          <Image
            src={project.media.url}
            alt={project.media.alt ?? project.title}
            width={1200}
            height={675}
            className="h-auto w-full"
          />
        </figure>
      ) : null}

      {project.media?.type === "gallery" ? (
        <ProjectGallery images={project.media.images} />
      ) : null}
    </CardContent>
  </Card>
);

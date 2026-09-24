import { createFileRoute } from '@tanstack/react-router'
import ProjectsPage from '@/src/pages/projects'

export const Route = createFileRoute('/projects/')({
  head: () => ({ meta: [{ title: 'projects | jake bodea' }, { name: 'description', content: "jake bodea's projects" }] }),
  component: ProjectsPage,
})

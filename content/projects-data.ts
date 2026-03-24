export interface ProjectData {
  title: string
  description: string
  media?: {
    type: "x-embed" | "image" | "youtube"
    url: string
  }
  liveUrl?: string
  repoUrl?: string
  techStack: string[]
}

export const projects: ProjectData[] = [
  {
    title: "Super Simple Secret Santa",
    description:
      "Uses a constraint optimization algorithm to assign secret santa players, with beautiful design and attention to detail.",
    media: {
      type: "x-embed",
      url: "https://x.com/jakebodea/status/1989381104776929363",
    },
    liveUrl: "https://supersimplesecretsanta.com",
    repoUrl: "https://github.com/jakebodea/secret-santa",
    techStack: ["TypeScript", "TanStack Start"],
  },
  {
    title: "Buddy",
    description:
      "An AI-assisted Chrome extension that can read page context and take approved actions like clicking and form-filling. Still in active development, so I'm linking the repo instead of a public demo for now.",
    repoUrl: "https://github.com/jakebodea/buddy",
    techStack: ["TypeScript", "React", "Vite", "Chrome MV3"],
  },
  {
    title: "Worship Admin",
    description:
      "Planning Center is widely used church software for service planning and team scheduling. Worship Admin is a more pleasant UI for building schedules, reviewing availability, and assigning people to positions, while using Planning Center's API as the backend. It includes authenticated account connections and OAuth, but it's still in active development and not ready to demo publicly yet.",
    repoUrl: "https://github.com/jakebodea/worship-admin",
    techStack: ["TypeScript", "Next.js", "Planning Center API", "Postgres"],
  },
];

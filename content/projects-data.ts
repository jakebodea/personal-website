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
];

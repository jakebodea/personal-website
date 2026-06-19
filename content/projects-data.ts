type ProjectMedia =
  | { type: "x-embed"; url: string }
  | { type: "image"; url: string; alt?: string }
  | { type: "youtube"; url: string }
  | { type: "gallery"; images: { url: string; alt: string }[] }

export interface ProjectData {
  title: string
  description: string
  media?: ProjectMedia
  liveUrl?: string
  repoUrl?: string
  techStack: string[]
}

export const projects: ProjectData[] = [
  {
    title: "TaxRise.com",
    description:
      "Marketing website for TaxRise that I built and maintain, including a custom CMS for managing the site. Content lives as MDX in Neon with draft/publish workflows, typed models for service pages, blog posts, IRS notices, and more, plus custom MDX components like Callouts. Assets are managed through a file browser built on Cloudflare R2.",
    liveUrl: "https://taxrise.com",
    media: {
      type: "gallery",
      images: [
        { url: "/images/taxrise-hero.png", alt: "Homepage hero" },
        { url: "/images/taxrise-services-hub.png", alt: "Services page" },
        { url: "/images/taxrise-contact.png", alt: "Contact page" },
        {
          url: "/images/taxrise-services.png",
          alt: "Tax levy service page",
        },
        { url: "/images/taxrise-cms-editor.png", alt: "CMS editor" },
        { url: "/images/taxrise-cms-assets.png", alt: "R2 assets browser" },
      ],
    },
    techStack: ["TypeScript", "Next.js", "Tailwind CSS", "Neon", "MDX", "R2"],
  },
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
    liveUrl: "https://worshipadmin.com",
    repoUrl: "https://github.com/jakebodea/worship-admin",
    techStack: ["TypeScript", "Next.js", "Planning Center API", "Postgres"],
  },
];

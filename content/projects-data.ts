type ProjectMedia =
  | { type: "x-embed"; url: string }
  | { type: "image"; url: string; alt?: string }
  | { type: "youtube"; url: string }
  | { type: "gallery"; images: { url: string; alt: string }[] };

export interface ProjectData {
  title: string;
  description: string;
  media?: ProjectMedia;
  liveUrl?: string;
  demoUrl?: string;
  demoNote?: string;
  repoUrl?: string;
  techStack: string[];
}

export const projects: ProjectData[] = [
  {
    title: "PCOBooster",
    description:
      "PCOBooster is an open source app I built for worship teams that plan services in Planning Center. For a selected plan, it shows open positions, availability, blockouts, conflicts, and each person's recent serving history. Schedulers can assign someone in PCOBooster and save the change to Planning Center. The product site has an interactive sample, and the live app has a read only demo.",
    liveUrl: "https://pcobooster.com",
    demoUrl: "/projects/pcobooster/demo",
    demoNote:
      "The demo shows fictional names instead of personal details. It shows live plan details and cannot change assignments. PCOBooster is independent of Planning Center.",
    repoUrl: "https://github.com/bodegalabs/pcobooster",
    media: {
      type: "image",
      url: "/images/pcobooster-assign.png",
      alt: "PCOBooster Assign view showing open team positions and candidates with fictional names",
    },
    techStack: [
      "TypeScript",
      "Next.js",
      "Hono",
      "Effect",
      "oRPC",
      "PostgreSQL",
      "Planning Center API",
    ],
  },
  {
    title: "TaxRise.com",
    description:
      "I built TaxRise's marketing website and its custom CMS for managing the site. The site used MDX content in Neon with draft/publish workflows, typed models for service pages, blog posts, IRS notices, and more, plus custom MDX components like Callouts. Its asset browser used Cloudflare R2.",
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
];

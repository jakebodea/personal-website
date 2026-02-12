# Personal Website

Personal website and blog built with Next.js App Router, deployed on Vercel.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **CMS**: [Notion API](https://developers.notion.com/) for quotes and blog content
- **Deployment**: [Vercel](https://vercel.com/) with ISR

## Development

```bash
bun install
bun run dev
```

## Notion Integration

Quotes and blogs are fetched from Notion databases via the REST API. Content is cached and auto-refreshes hourly using Next.js ISR (`revalidate: 3600`).

The integration handles Notion's rich text formatting:
- Converts literal `\n` and `\t` to actual newlines/tabs
- Preserves formatting while extracting plain text
- Creates markdown-style links for authors

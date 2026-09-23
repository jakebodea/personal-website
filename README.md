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

## Resume Studio

The repository also contains a private resume workflow driven by a coding agent.
Its reusable skill and renderer are versioned here; career evidence and application
records live in Notion. Read [How Resume Studio works](docs/resume-studio.md) for
the workflow, approval steps, setup requirements, and review guide.

## PCOBooster portfolio demo

The PCOBooster card on `/projects` links to a server route that redirects to the
read-only app demo. Production uses the sensitive Vercel environment variable
`PCOBOOSTER_DEMO_ACCESS_KEY`, copied from PCOBooster's Infisical Production `/`
configuration. When it is absent, the route opens PCOBooster's public interactive
replica. Update the personal-site variable and redeploy after rotating the demo
key in PCOBooster.

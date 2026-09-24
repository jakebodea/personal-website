# Personal Website

Personal website and blog built with TanStack Start for Cloudflare Workers.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [TanStack Start](https://tanstack.com/start) and [TanStack Router](https://tanstack.com/router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Content**: [Notion API](https://developers.notion.com/) for quotes and Markdown files for writings
- **Deployment**: [Cloudflare Workers](https://developers.cloudflare.com/workers/) with Cloudflare assets and cache
- **Chat**: Cloudflare Workers AI (`@cf/openai/gpt-oss-120b`)

## Development

```bash
bun install
bun run dev
bun run tsc
bun run lint
bun run build
bun run check:deploy-output
```

## Notion Integration

Quotes are fetched from Notion via its REST API and cached for one hour in Cloudflare's cache. Writings are built from the public Markdown files in `content/writings/`.

The integration handles Notion's rich text formatting:
- Converts literal `\n` and `\t` to actual newlines/tabs
- Preserves formatting while extracting plain text
- Creates markdown-style links for authors

## Deployment

The `personal-website` Worker configuration is in `wrangler.jsonc`. `bun run deploy` builds and deploys the Worker to `personal-website.jakebodea.workers.dev`. Cloudflare Workers Builds runs `bun run build && bun run check:deploy-output` and then `npx wrangler deploy` for the configured production branch; its build variable `BUN_VERSION` is `1.3.9`. Configure `NOTION_TOKEN` and `QUOTES_DATABASE_ID` with `wrangler secret put` before verifying `/quotes`. `PCOBOOSTER_DEMO_ACCESS_KEY` is optional; when absent, the demo redirect opens the public PCOBooster replica. The AI binding is declared in `wrangler.jsonc` and does not use a Vercel AI Gateway key.

`jakebodea.com` and `www.jakebodea.com` are attached to the Worker as Custom Domains and declared in `wrangler.jsonc`. The Worker redirects `www` to the apex. Porkbun uses Cloudflare's assigned nameservers. Verify both hostnames and the chat and demo flows after each deployment; keep the previous origin available until DNS caches have expired.

The private Resume Studio workspace stays out of the Worker bundle. CI checks the built output for private paths and markers. Do not import `.resume-studio/`, `resume/`, or the agent skill from public routes.

## Resume Studio

The repository also contains a private resume workflow driven by a coding agent.
Its reusable skill and renderer are versioned here; career evidence and application
records live in Notion. Read [How Resume Studio works](docs/resume-studio.md) for
the workflow, approval steps, setup requirements, and review guide.

## PCOBooster portfolio demo

The PCOBooster card on `/projects` links to a server route that redirects to the
read-only app demo. The optional `PCOBOOSTER_DEMO_ACCESS_KEY` Worker secret comes
from PCOBooster's Infisical Production `/` configuration. When absent, the route
opens PCOBooster's public interactive replica. Update the Worker secret after
rotating the demo key in PCOBooster.

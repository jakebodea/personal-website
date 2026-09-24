# Project guidance

Use Bun for installs and scripts. Public site code lives in `src/`, `components/`, `lib/`, `content/`, and `public/`. TanStack Start builds a Cloudflare Worker from `vite.config.ts` and `wrangler.jsonc`.

## Before deployment

1. Run `bun run tsc`, `bun run lint`, `bun run build`, and `bun run check:deploy-output`. This passes when types, lint, build, and the private-content check succeed.
2. Verify `/`, `/projects`, `/timeline`, `/writings`, `/writings/prod`, `/quotes`, `/chat`, and `/projects/pcobooster/demo` on the Worker preview. This passes when pages render, Notion data loads, chat responds, and the redirect has the expected destination.
3. Follow the DNS and secret cutover steps in `README.md`. This passes when the custom domain serves the verified Worker and the old origin is no longer needed.

The private Resume Studio workflow is described in `.agents/skills/resume-studio/SKILL.md` and `docs/resume-studio.md`. Its working files and resume artifacts stay outside the public bundle. Run `bun run check:deploy-output` after changes that affect bundling.

Code conventions: TypeScript; kebab-case source files except TanStack route files; `type` imports for types; 2-space indentation; self-closing JSX components. `lib/notion.ts` is the single Notion API integration. Public blog posts are Markdown in `content/writings/`; quotes come from Notion and use a one-hour Worker cache.

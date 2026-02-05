# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Start development server
bun run build     # Production build
bun run lint      # Run ESLint with --fix
bun run check-notion  # Check Notion for content changes
```

Always use Bun, not Node.js/npm/pnpm. Bun automatically loads `.env` files.

## Architecture

**Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion

**Static Site on GitHub Pages**: No server runtime. All data fetching happens at build time. Notion content syncs via scheduled GitHub Actions that detect changes and trigger rebuilds.

### Content Sources
- **Quotes**: Fetched from Notion API at build time, client-side searchable
- **Blogs**: Markdown files in `/content/blogs/`, parsed with gray-matter
- **Timeline**: Static TypeScript data in `/content/timeline-data.ts`

### Key Files
- `lib/notion.ts` - All Notion API integration (~17KB, exempted from max-lines rule)
- `lib/quotes.ts` - Quote fetching entry point
- `lib/blogs.ts` - Markdown blog loading with search
- `app/layout.tsx` - Root layout, preloads quotes cache
- `scripts/check-notion.ts` - Smart content change detection for GitHub Actions

### Server vs Client Components
- Pages are server components by default
- `"use client"` used for interactive components (TopNav, search features)

## Code Standards

### Naming (enforced via ESLint)
- Files: `kebab-case` (e.g., `top-nav.tsx`)
- Folders: `kebab-case` (except `[slug]` and `(groups)` for Next.js routing)
- Max 300 lines per file (exceptions: `lib/notion.ts`)

### TypeScript
- Use `type` imports: `import type { Foo } from './bar'`
- Unused vars must be prefixed with `_`

### React/JSX
- Self-closing components: `<Component />` not `<Component></Component>`
- No unnecessary boolean values: `disabled` not `disabled={true}`
- No unnecessary curly braces: `prop="value"` not `prop={"value"}`

### Styling
- Use variant props on Shadcn UI components, not `className`
- `className` allowed only on HTML primitives, Link, Image, and motion.* components
- Component files in `/components/` are exempt from this rule

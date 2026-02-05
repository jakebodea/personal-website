# Notion Content Databases

This document captures a Notion schema that supports both curated quotes and long-form blog posts while keeping Markdown as the content source of truth. The goal is to mirror the existing quotes workflow so the website can reuse a single synchronization pipeline for multiple content types.

## Quotes Database (existing)

- **Database name**: `Quotes`
- **Recommended view**: table sorted by author ascending, created descending
- **Properties**
  - `quote` (Title): the quote text. The page title is the quote for ease of copy/paste.
  - `author_link` (URL or Rich Text): optional canonical link to the author. Use plain text if no link.
  - *(auto)* `Created time`, `Last edited time`: leave the Notion defaults in place.

### Markdown considerations

- Quotes do not require block-level Markdown conversion because the `quote` property contains the entire string.
- The automation concatenates `author` and `quote` fields; treat Markdown characters (`*`, `_`, `` ` ``) literally—escaping is handled before rendering.

## Blogs Database (new)

- **Database name**: `Blogs`
- **Recommended views**
  - Kanban by `Status` to manage drafts vs. published posts
  - Table filtered to `Status = Published`, sorted by `Publish Date` descending
- **Properties**
  - `Name` (Title): public-facing blog title. Serves as the page name.
  - `Slug` (Formula or Rich Text): stable identifier used for routing. Example formula: `slug(title)` via [Notion-enhancer](https://notion.so/help/slug) or a manual text property.
  - `Summary` (Rich Text): short teaser displayed on listing cards. Keep it under ~160 characters.
  - `Publish Date` (Date): canonical publication date; defaults to the current day when empty.
  - `Status` (Select): values `Draft`, `Review`, `Published`. Automations only sync entries marked `Published`.
  - `Tags` (Multi-select): optional taxonomy for filtering. Use singular nouns (e.g., `product`, `personal`).
  - `Canonical URL` (URL): back-link if the article originates elsewhere.
  - *(optional)* `Hero Image` (Files & media): stored for later enrichment but ignored by the Markdown exporter for now.

### Page content as Markdown

- Write the main article inside the Notion page body using native blocks.
- Stick to blocks with clear Markdown equivalents (headings, paragraphs, bulleted/numbered lists, quotes, code, callouts, toggles, images, bookmarks).
- Use inline code spans instead of the legacy “code” text style; both convert cleanly.
- For equations, prefer block-level `Equation`—the exporter falls back to the TeX string.
- Avoid complex synced blocks or embeds that lack Markdown equivalents; they will degrade to simple links.

### Export behaviour

- The sync script retrieves page blocks via `GET /v1/blocks/{page_id}/children`, recursively expanding children.
- Blocks are converted to Markdown with the following mapping:
  - Headings → `#`, `##`, `###`
  - Paragraphs → plain text separated by blank lines
  - Bullet/numbered list items → `-` / `1.` with nesting preserved via indentation
  - Quotes → prefixed with `>`
  - Code blocks → fenced code with the detected language
  - Callouts → blockquote with emoji hint (e.g., `> 💡`)
  - Toggles → bullet item followed by an indented block containing the children
  - Images & bookmarks → converted to Markdown links referencing the Notion-provided URL
- Unsupported block types degrade to a comment noting the original type so manual review can fix the content.

### Required environment variables

- `NOTION_TOKEN`: integration token with read access to both `Quotes` and `Blogs` databases.
- `QUOTES_DATABASE_ID`: 32-character database ID for the quotes table.
- `BLOGS_DATABASE_ID`: 32-character database ID for the blogs table.

Store the IDs in project secrets and share the integration with both databases inside Notion.

## Synchronisation Workflow

1. A scheduled GitHub Action (`check-notion.yml`) fetches both databases using Bun.
2. The script hashes the quote list and each blog entry’s Markdown payload. Separate hash files (`quotes-hash.txt`, `blogs-hash.txt`) cache the last known state.
3. If either hash changes, the workflow triggers the build/deploy pipeline; otherwise it exits after logging “No changes”.

This approach keeps Notion as the single source of truth, while the site consumes Markdown-compatible content that can be rendered locally or pre-generated as static files.


# Personal Website

This is my personal website and blog built with a modern component-based architecture. This README explains the technical decisions and architecture for those curious about how it works.

## Tech Stack

The project uses a modern tech stack focused on developer experience, performance, and best practices:

-   **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime and package manager
-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) for light/dark mode.
-   **Markdown/MDX**: `react-markdown` with `remark` and `rehype` for rendering blog posts.
-   **CMS**: [Notion API](https://developers.notion.com/) for managing quotes content.

## Project Structure

The project follows a structure that separates concerns while taking advantage of Next.js App Router features:

-   `app/`: Contains all the routes and pages for the application. Each folder represents a URL segment.
    -   `app/layout.tsx`: The root layout of the application.
    -   `app/(home)/page.tsx`: The entry point for the homepage.
    -   `app/(routes)`: Subdirectories for each page (e.g., `blogs`, `projects`), containing their specific components and logic.
-   `components/`: Contains reusable components shared across the application.
    -   `components/ui`: UI primitives from Shadcn UI.
    -   `components/layout`: Components that define the structure of the site, like the `Sidebar`.
    -   `components/providers`: Wrapper components that provide context to the application (e.g., `ThemeProvider`).
-   `content/`: Stores static data and content, such as blog posts or timeline information.
-   `lib/`: Utility functions and helper scripts.
-   `public/`: Static assets like images and fonts.

## How It Works

The website is built using **Bun** as the runtime and package manager for faster development and builds. The development server runs with `bun run dev` and leverages Next.js's App Router for routing and server-side rendering.

## Dynamic Quotes with Notion Integration

The quotes page uses a custom Notion integration to dynamically fetch and display quotes from a personal Notion database. This creates a seamless CMS experience where I can add new quotes directly in Notion and they appear on the website.

### Technical Implementation

Instead of using the official Notion SDK, the integration uses direct REST API calls to `https://api.notion.com/v1/databases/{database_id}/query`.

### Database Structure

The Notion database uses a simple schema:

- **Page Title**: Author name (e.g., "James Clear")
- **quote** (Rich Text): The quote content with support for line breaks and formatting
- **author_link** (URL): Optional link to the author's profile/website

### Smart Text Processing

The system handles Notion's rich text formatting by:
- Converting literal `\n` and `\t` characters to actual newlines and tabs
- Preserving formatting while extracting plain text
- Creating markdown-style links when author links are provided

### Performance Optimizations

- **Server-side caching**: Pages are cached for 1 hour using Next.js `revalidate`
- **Client-side rendering**: Quotes are shuffled and filtered on the client for smooth interactions
- **Search functionality**: Real-time search through quotes and authors without additional API calls

### Markdown Support

The frontend includes a custom markdown renderer that handles:
- **Bold** and *italic* text formatting
- Automatic URL linking
- Line breaks and paragraph formatting
- Clickable author links when available

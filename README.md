# Personal Website

This is a personal website and blog built with a component-based architecture using Next.js.

## Tech Stack

The project uses a modern tech stack focused on developer experience, performance, and best practices:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) for light/dark mode.
-   **Markdown/MDX**: `react-markdown` with `remark` and `rehype` for rendering blog posts.

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

## Getting Started

To get the project running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

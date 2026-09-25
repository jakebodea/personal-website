import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import { JakeChatWidget } from "@/components/jake-chat/jake-chat-widget";
import { PageTransition } from "@/components/layout/page-transition";
import { TopNav } from "@/components/layout/top-nav";
import { NavigationProvider } from "@/components/providers/navigation-provider";
import { StickyTitleProvider } from "@/components/providers/sticky-title-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "../styles.css";
import "@fontsource-variable/montserrat/index.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";

const SITE_NAME = "jake bodea";

const Root = () => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <HeadContent />
    </head>
    <body className="min-h-screen bg-background font-sans text-foreground">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <NavigationProvider>
          <StickyTitleProvider>
            {import.meta.env.DEV && (
              <div className="fixed left-2 top-2 z-[100] rounded bg-accent px-2 py-1 text-xs font-bold text-white">
                dev
              </div>
            )}
            <TopNav />
            <main className="min-h-[calc(100vh-3.5rem)]">
              <PageTransition>
                <Outlet />
              </PageTransition>
            </main>
            <Toaster />
            <JakeChatWidget />
          </StickyTitleProvider>
        </NavigationProvider>
      </ThemeProvider>
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_NAME },
      { name: "description", content: `${SITE_NAME}'s personal website` },
      { property: "og:title", content: SITE_NAME },
      { property: "og:description", content: "personal website" },
      { property: "og:url", content: "https://jakebodea.com" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  component: Root,
});

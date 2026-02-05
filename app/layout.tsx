import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { NavigationProvider } from "@/components/providers/navigation-provider"
import { Toaster } from "@/components/ui/sonner"
import { Montserrat, Instrument_Serif } from "next/font/google"
import { TopNav } from "@/components/layout/top-nav"
import { PageTransition } from "@/components/layout/page-transition"
import { GPTSlopToast } from "@/components/gpt-slop-toast"
import { Analytics } from "@vercel/analytics/next"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
})

export const metadata = {
  title: {
    default: "jake bodea",
    template: "%s | jake bodea",
  },
  description: "jake bodea's personal website",
  openGraph: {
    title: "jake bodea",
    description: "personal website",
    url: "https://jakebodea.com",
    siteName: "jake bodea",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://jakebodea.com"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${instrumentSerif.variable} font-sans`}
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationProvider>
            {process.env.VERCEL_GIT_COMMIT_REF === "dev" && (
              <div className="fixed top-2 right-2 z-[100] bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                dev
              </div>
            )}
            <TopNav />
            <main className="min-h-[calc(100vh-3.5rem)]">
              <PageTransition>{children}</PageTransition>
            </main>
            <Toaster />
            <GPTSlopToast />
          </NavigationProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

import { SidebarProvider } from "@/components/ui/sidebar"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { GPTSlopToast } from "@/components/GPTSlopToast"
import Script from 'next/script'
import { Montserrat, Instrument_Serif } from 'next/font/google'
// We can't dynamically import a client component with ssr: false in a server component,
// so we've created a wrapper component to handle the client-side-only import of the Sidebar.
import { Sidebar } from "@/components/layout/Sidebar"
import { CanvasTrigger } from "../components/layout/CanvasTrigger"

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Jake Bodea',
    template: '%s | Jake Bodea'
  },
  description: 'Jake Bodea\'s personal website',
  openGraph: {
    title: 'Jake Bodea',
    description: 'Personal Website',
    url: 'https://jakebodea.com',
    siteName: 'Jake Bodea Personal Website',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://jakebodea.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${instrumentSerif.variable} font-sans`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex h-screen w-screen scrollbar-thin bg-background">
              <Sidebar />
              <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
                <div className="p-4 h-full min-h-0 flex-1 relative">
                  <CanvasTrigger />
                  <main className="h-full overflow-auto scrollbar-thin rounded-2xl border border-border/20 shadow-lg bg-gradient-to-br from-[#FBFAF4] to-[#EAEEEF] dark:bg-gradient-to-br dark:from-background dark:to-contrast-lighter">{children}</main>
                </div>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
          <GPTSlopToast />
        </ThemeProvider>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  )
}

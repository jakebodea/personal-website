import { SidebarProvider } from "@/components/ui/sidebar"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SiteToast } from "@/components/site-toast"
import Script from 'next/script'

import { SidebarWrapper } from '@/components/sidebar-wrapper'

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
    <html lang="en" suppressHydrationWarning className={`font-sans`}>
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
            <div className="flex h-screen w-screen">
              <SidebarWrapper />
              <main className="flex-1">{children}</main>
            </div>
          </SidebarProvider>
          <Toaster />
          <SiteToast />
        </ThemeProvider>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  )
}

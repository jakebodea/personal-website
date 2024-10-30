import dynamic from 'next/dynamic'
import { SidebarProvider } from "@/components/ui/sidebar"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Roboto } from 'next/font/google'
import { SiteToast } from "@/components/site-toast"
import Script from 'next/script'


const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

const AppSidebar = dynamic(() => import('@/components/app-sidebar').then(mod => mod.AppSidebar), { ssr: false })

export const metadata = {
  title: {
    default: 'Jake Bodea',
    template: '%s | Jake Bodea'
  },
  description: 'Jake Bodea\'s personal website'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${roboto.variable} font-sans`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex h-screen w-screen">
              <AppSidebar />
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

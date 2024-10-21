import dynamic from 'next/dynamic'
import { SidebarProvider } from "@/components/ui/sidebar"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const AppSidebar = dynamic(() => import('@/components/app-sidebar').then(mod => mod.AppSidebar), { ssr: false })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
        </ThemeProvider>
      </body>
    </html>
  )
}

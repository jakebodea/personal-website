import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="flex h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="bg-gray-100 p-4">
                <SidebarTrigger />
              </header>
              <main className="flex-1 overflow-auto p-4">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}

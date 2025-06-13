"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

import { useTheme } from "next-themes"

const data = {
  pages: [
    {
      title: "Home",
      url: "/",
      icon: "🏠"
    },
    {
      title: "Timeline",
      url: "/timeline",
      icon: "⏳"
    },
    {
      title: "Projects",
      url: "/projects",
      icon: "💻"
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: "📝"
    }
  ],
  contact: [
    {
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/jakebodea/",
      icon: "🖇"
    },
    {
      title: "GitHub",
      url: "https://github.com/jakebodea",
      icon: "🐙"
    },
    {
      title: "𝕏",
      url: "https://x.com/jakebodea",
      icon: "🐦"
    }
  ]
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = parseInt(event.key)
      if (!isNaN(key) && key > 0 && key <= data.pages.length) {
        router.push(data.pages[key - 1].url)
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [router])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 't') {
        setTheme(theme === "light" ? "dark" : "light")
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [theme, setTheme]); // Add setTheme to the dependency array

  if (!mounted) {
    return null // Return null on server-side and first render on client-side
  }

  return (
    <Sidebar variant="inset" {...props} className="border-r-0">
      <SidebarHeader className="flex flex-col items-start px-6 py-8 border-b border-border/30">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Jake Bodea</h1>
          <p className="text-sm text-muted-foreground font-medium">AI/ML Professional</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-3 py-4">
          <div className="mb-2 px-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</h2>
          </div>
          {data.pages.map((item, index) => (
            <Link href={item.url} key={item.url}>
              <SidebarMenuButton size="lg" className="w-full justify-start gap-3 px-3 py-2.5 hover:bg-[#D5DDDF] active:bg-[#96AAAE] dark:hover:bg-accent/50 dark:active:bg-accent/70 transition-colors group">
                <span className="text-base">{item.icon}</span>
                <span className="text-foreground font-medium group-hover:text-foreground transition-colors">{item.title}</span>
                <span className="ml-auto text-xs text-muted-foreground/60 font-mono">{index + 1}</span>
              </SidebarMenuButton>
            </Link>
          ))}
        </SidebarGroup>
        <SidebarGroup className="px-3 py-4">
          <div className="mb-2 px-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Connect</h2>
          </div>
          {data.contact.map((item) => (
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
              key={item.url}
            >
              <SidebarMenuButton size="lg" className="w-full justify-start gap-3 px-3 py-2.5 hover:bg-[#D5DDDF] active:bg-[#96AAAE] dark:hover:bg-accent/50 dark:active:bg-accent/70 transition-colors group">
                <span className="text-base">{item.icon}</span>
                <span className="text-foreground font-medium group-hover:text-foreground transition-colors">{item.title}</span>
                <ArrowUpRight className="ml-auto size-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
              </SidebarMenuButton>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-6 py-4 border-t border-border/30 space-y-3">
          <div className="text-xs text-muted-foreground">
            <p>Use <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded font-mono">1-4</kbd> to navigate</p>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded font-mono">T</kbd> to toggle theme</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Moon, Sun, ArrowUpRight } from "lucide-react"
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
import { Button } from "@/components/ui/button"
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
      title: "Events",
      url: "/events",
      icon: "🗓️"
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
    <Sidebar variant="inset" {...props} className="font-light">
      <SidebarHeader className="flex flex-col items-start mt-4">
        <span className="text-3xl text-primary font-normal">Jake Bodea</span>
        <span className="text-lg font-light italic">AI/ML Professional</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {data.pages.map((item, index) => (
            <Link href={item.url} key={item.url}>
              <SidebarMenuButton size="lg">
                <span className="text-lg mr-2">{item.icon}</span>
                <span className="text-primary">{item.title}</span>
                <span className="ml-auto text-sm text-muted-foreground">{index + 1}</span>
              </SidebarMenuButton>
            </Link>
          ))}
        </SidebarGroup>
        <SidebarGroup>
          <SidebarHeader className="font-light italic">Contact Me</SidebarHeader>
          {data.contact.map((item) => (
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full"
              key={item.url}
            >
              <SidebarMenuButton size="lg">
                <span className="text-lg mr-2">{item.icon}</span>
                <span>{item.title}</span>
                <ArrowUpRight className="ml-auto size-4" />
              </SidebarMenuButton>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col justify-start">
          <span className="text-sm pb-2 italic">Navigate tabs with keyboard!</span>
          <span className="flex items-center">
            <Button variant="ghost" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>
            <span className="text-sm pl-2 italic">or press &apos;t&apos;</span>
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

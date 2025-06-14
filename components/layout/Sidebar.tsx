"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
} from "@/components/ui/sidebar"

import { useTheme } from "next-themes"
import { sidebarData } from "@/content/sidebar-data";
import { SidebarHeader } from "./SidebarHeader"
import { SidebarNavigation } from "./SidebarNavigation"
import { SidebarConnect } from "./SidebarConnect"
import { SidebarFooter } from "./SidebarFooter"


export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarPrimitive>) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = parseInt(event.key)
      if (!isNaN(key) && key > 0 && key <= sidebarData.pages.length) {
        router.push(sidebarData.pages[key - 1].url)
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [router])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger theme toggle if user is typing in an input field
      const activeElement = document.activeElement
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      )
      
      if (event.key === 't' && !isInputFocused) {
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
    <SidebarPrimitive variant="inset" {...props} className="border-r-0">
      <SidebarHeader />
      <SidebarContent>
        <SidebarNavigation />
        <SidebarConnect />
      </SidebarContent>
      <SidebarFooter />
    </SidebarPrimitive>
  )
}

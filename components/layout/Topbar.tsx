"use client"

import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Topbar() {
  return (
    <nav className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-border/30 bg-background/80 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-14 sm:px-4">
      <SidebarTrigger className="h-8 w-8 md:hidden" />
      <Link href="/" className="font-medium text-foreground hover:opacity-80 transition-opacity">
        Jake Bodea
      </Link>
    </nav>
  )
}



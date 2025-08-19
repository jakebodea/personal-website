"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export function CanvasTrigger() {
  const { isMobile, state } = useSidebar()
  const show = isMobile || state === "collapsed"
  if (!show) return null
  return (
    <div className="pointer-events-none absolute top-4 left-6 z-40 animate-in fade-in-0 duration-2000 ease-out">
      <div className="pointer-events-auto rounded-xl p-2 md:p-3">
        <SidebarTrigger className="h-7 w-7" />
      </div>
    </div>
  )
}



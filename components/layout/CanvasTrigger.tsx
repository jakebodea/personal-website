"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export function CanvasTrigger() {
  const { isMobile, state, openMobile } = useSidebar()
  const [shouldAnimate, setShouldAnimate] = useState(false)
  
  // On mobile, show when sidebar is closed. On desktop, show when collapsed
  const show = isMobile ? !openMobile : state === "collapsed"
  
  useEffect(() => {
    if (isMobile) {
      // On mobile, animate when sidebar closes (openMobile becomes false)
      if (!openMobile) {
        // Wait for mobile sidebar transition to complete before starting animation
        const timer = setTimeout(() => {
          setShouldAnimate(true)
        }, 300)
        
        return () => clearTimeout(timer)
      } else {
        setShouldAnimate(false)
      }
    } else {
      // Desktop logic - same as before
      if (state === "collapsed") {
        const timer = setTimeout(() => {
          setShouldAnimate(true)
        }, 300)
        
        return () => clearTimeout(timer)
      } else {
        setShouldAnimate(false)
      }
    }
  }, [isMobile, state, openMobile])
  
  if (!show) return null
  
  return (
    <div className={`pointer-events-none absolute ${isMobile ? 'top-2 left-4' : 'top-4 left-6'} z-40 ${
      shouldAnimate 
        ? "animate-in fade-in-0 slide-in-from-left-2 duration-4000 ease-out" 
        : "opacity-0"
    }`}>
      <div className={`pointer-events-auto rounded-xl p-2 md:p-3 ${
        shouldAnimate 
          ? "animate-in zoom-in-95 duration-3500 ease-out" 
          : "scale-95"
      }`}>
        <SidebarTrigger className="h-7 w-7" />
      </div>
    </div>
  )
}



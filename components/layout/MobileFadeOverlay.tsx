"use client"

import { useIsMobile } from "@/hooks/use-mobile"

export function MobileFadeOverlay() {
  const isMobile = useIsMobile()
  
  if (!isMobile) return null
  
  return (
    <div className="absolute inset-x-0 top-0 h-20 pointer-events-none z-30 bg-gradient-to-b from-[#FBFAF4] from-3% via-[#FBFAF4]/98 via-12% to-[#FBFAF4]/0 to-100% dark:from-background dark:from-3% dark:via-background/98 dark:via-12% dark:to-background/0 dark:to-100%" />
  )
}

"use client"

import { cn } from "@/lib/utils"

interface MenuIconProps {
  isOpen: boolean
  className?: string
}

export function MenuIcon({ isOpen, className }: MenuIconProps) {
  return (
    <div className={cn("relative w-5 h-5 flex flex-col justify-center", className)}>
      <span
        className={cn(
          "absolute h-[1.5px] w-full bg-muted-foreground transition-all duration-150",
          isOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-[6px]"
        )}
      />
      <span
        className={cn(
          "absolute h-[1.5px] w-full bg-muted-foreground transition-all duration-150",
          isOpen ? "-rotate-45 top-1/2 -translate-y-1/2" : "bottom-[6px]"
        )}
      />
    </div>
  )
}

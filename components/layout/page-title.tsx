"use client"

import { cn } from "@/lib/utils"

interface PageTitleProps {
  children: string
  className?: string
  as?: "h1" | "h2" | "h3"
}

export function PageTitle({ children, className, as: Tag = "h1" }: PageTitleProps) {
  return (
    <>
      {/* Mobile: sticky title that stays in header area */}
      <div className="md:hidden sticky top-0 z-50 bg-background -mx-6 px-6 h-14 flex items-center">
        <Tag className={cn(className, "!m-0")}>
          {children}
        </Tag>
      </div>
      {/* Desktop: normal static title */}
      <Tag className={cn("hidden md:block", className)}>
        {children}
      </Tag>
    </>
  )
}

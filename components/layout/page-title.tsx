"use client"

import { cn } from "@/lib/utils"

interface PageTitleProps {
  children: string
  as?: "h1" | "h2" | "h3"
  variant?: "home" | "page" | "blog"
}

const variantStyles = {
  home: "text-4xl md:text-5xl font-serif mb-8 text-foreground",
  page: "text-4xl md:text-5xl font-serif mb-4 text-foreground",
  blog: "font-serif font-light text-4xl md:text-5xl text-foreground mb-2",
}

export function PageTitle({ children, as: Tag = "h1", variant = "home" }: PageTitleProps) {
  const styles = variantStyles[variant]

  return (
    <div className="sticky top-0 z-50 bg-background -mx-6 px-6 h-14 flex items-center">
      <Tag className={cn(styles, "!m-0")}>{children}</Tag>
    </div>
  )
}

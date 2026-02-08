import { cn } from "@/lib/utils"

interface PageTitleProps {
  children: string
  as?: "h1" | "h2" | "h3"
  variant?: "home" | "page" | "blog"
  className?: string
}

const variantStyles = {
  home: "text-4xl md:text-5xl font-serif mb-8 text-foreground",
  page: "text-4xl md:text-5xl font-serif mb-4 text-foreground",
  blog: "font-serif font-light text-4xl md:text-5xl text-foreground mb-2",
}

export function PageTitle({ children, as: Tag = "h1", variant = "home", className }: PageTitleProps) {
  return <Tag className={cn(variantStyles[variant], className)}>{children}</Tag>
}

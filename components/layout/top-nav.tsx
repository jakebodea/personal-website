"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sun, Moon } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ShortcutTooltip } from "@/components/common/shortcut-tooltip"

const navItems = [
  { title: "home", href: "/" },
  { title: "timeline", href: "/timeline" },
  { title: "projects", href: "/projects" },
  { title: "blogs", href: "/blogs" },
  { title: "quotes", href: "/quotes" },
]

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      const num = parseInt(e.key)
      if (num >= 1 && num <= navItems.length) {
        router.push(navItems[num - 1].href)
      }
      if (e.key === "t") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resolvedTheme, setTheme, router])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex h-14 items-center justify-center">
          {/* Navigation Tabs - horizontal scroll on mobile */}
          <TooltipProvider delayDuration={300}>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
              {navItems.map((item, index) => (
                <ShortcutTooltip key={item.href} shortcut={String(index + 1)}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-3 py-1.5 text-sm whitespace-nowrap transition-colors rounded-md",
                      isActive(item.href)
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-accent/10 rounded-md"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.title}</span>
                  </Link>
                </ShortcutTooltip>
              ))}

              {/* Theme toggle */}
              {mounted && (
                <ShortcutTooltip shortcut="t">
                  <button
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    className="ml-2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md shrink-0"
                    aria-label="Toggle theme"
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </button>
                </ShortcutTooltip>
              )}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  )
}

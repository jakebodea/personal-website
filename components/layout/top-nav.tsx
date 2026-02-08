"use client"

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MenuIcon } from "@/components/ui/menu-icon"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ShortcutTooltip } from "@/components/common/shortcut-tooltip"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { ThemeToggle } from "@/components/layout/theme-toggle"

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navContainerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const activeIndex = navItems.findIndex(item => isActive(item.href))

  // Measure active tab position (scroll-independent via offsetLeft/offsetWidth)
  useLayoutEffect(() => {
    const container = navContainerRef.current
    if (!container || activeIndex === -1) return
    const links = container.querySelectorAll<HTMLAnchorElement>("a")
    const activeLink = links[activeIndex]
    if (activeLink) {
      setIndicator({ left: activeLink.offsetLeft, width: activeLink.offsetWidth, opacity: 1 })
    }
  }, [activeIndex, pathname])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      const num = parseInt(e.key)
      if (num >= 1 && num <= navItems.length) {
        window.scrollTo(0, 0)
        router.push(navItems[num - 1].href)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-[80] w-full bg-transparent">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex h-14 items-center justify-center">
            {/* Desktop Navigation */}
            <TooltipProvider delayDuration={300}>
              <div ref={navContainerRef} className="relative hidden md:flex items-center gap-1">
                <motion.span
                  className="absolute top-0 bottom-0 bg-accent/10 rounded-md"
                  animate={indicator}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
                {navItems.map((item, index) => (
                  <ShortcutTooltip key={item.href} shortcut={String(index + 1)}>
                    <Link
                      href={item.href}
                      onClick={() => window.scrollTo(0, 0)}
                      className={cn(
                        "relative px-3 py-1.5 text-sm whitespace-nowrap transition-colors rounded-md",
                        isActive(item.href)
                          ? "text-accent"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="relative z-10">{item.title}</span>
                    </Link>
                  </ShortcutTooltip>
                ))}

                {/* Desktop Theme toggle */}
                <div className="ml-2 shrink-0">
                  <ThemeToggle shortcut="t" />
                </div>
              </div>
            </TooltipProvider>

            {/* Mobile Header */}
            <div className="flex md:hidden items-center justify-end w-full">
              <div className="flex items-center gap-2 -mr-2">
                {/* Mobile Theme toggle */}
                <ThemeToggle iconSize="md" align="end" />
                {/* Hamburger button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <MenuIcon isOpen={mobileMenuOpen} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        navItems={navItems}
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </>
  )
}

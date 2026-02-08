"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
}

interface MobileMenuProps {
  navItems: NavItem[]
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ navItems, isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  // Close on route change
  React.useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Close on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.1, delay: 0.1 } }}
          className="fixed inset-0 z-[70] bg-background md:hidden"
        >
          {/* Spacer for nav header */}
          <div className="h-14" />

          {/* Nav Links */}
          <nav className="flex flex-col px-6 mx-auto max-w-4xl w-full">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.15, delay: index * 0.03 } }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.1, delay: (navItems.length - 1 - index) * 0.02 } }}
              >
                <Link
                  href={item.href}
                  onClick={() => window.scrollTo(0, 0)}
                  className={cn(
                    "block py-4 text-2xl font-medium transition-colors",
                    isActive(item.href)
                      ? "text-accent"
                      : "text-muted-foreground active:text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

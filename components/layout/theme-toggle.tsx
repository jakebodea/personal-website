"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun, Monitor } from "lucide-react"

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
}

const themeOptions = [
  { value: "dark", label: "dark", icon: Moon },
  { value: "light", label: "light", icon: Sun },
  { value: "system", label: "system", icon: Monitor },
] as const

const iconTransition = {
  duration: 0.15,
}

const dropdownTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
}

function ThemeIcon({ theme, className }: { theme: string; className: string }) {
  const option = themeOptions.find((o) => o.value === theme)
  const Icon = option?.icon ?? Moon
  return <Icon className={className} />
}

export function ThemeToggle({ iconSize = "sm" }: { iconSize?: "sm" | "md" }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Click-outside dismissal
  React.useEffect(() => {
    if (!isOpen) return

    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [isOpen])

  // Keyboard handling
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      if (e.key === "t") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
        setIsOpen(false)
      }

      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resolvedTheme, setTheme])

  if (!mounted) return null

  const sizeClass = iconSizeClasses[iconSize]

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={iconTransition}
          >
            <ThemeIcon theme={theme ?? "dark"} className={sizeClass} />
          </motion.div>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={dropdownTransition}
            className="absolute right-0 top-full mt-1 z-[90] bg-popover border border-border rounded-md shadow-md p-1"
          >
            {themeOptions.map((option) => {
              const isActive = theme === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value)
                    setIsOpen(false)
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded-sm transition-colors ${
                    isActive
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

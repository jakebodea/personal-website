"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun, Monitor } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShortcutTooltip } from "@/components/common/shortcut-tooltip"

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

function ThemeIcon({ theme, className }: { theme: string; className: string }) {
  const option = themeOptions.find((o) => o.value === theme)
  const Icon = option?.icon ?? Moon
  return <Icon className={className} />
}

export function ThemeToggle({
  iconSize = "sm",
  shortcut,
}: {
  iconSize?: "sm" | "md"
  shortcut?: string
}) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 't' keyboard shortcut for quick toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      if (e.key === "t") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resolvedTheme, setTheme])

  // Cleanup leave timer on unmount
  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
    }
  }, [])

  if (!mounted) return null

  const sizeClass = iconSizeClasses[iconSize]

  const handlePointerEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }

  const handlePointerLeave = () => {
    leaveTimer.current = setTimeout(() => setOpen(false), 100)
  }

  const trigger = (
    <DropdownMenuTrigger asChild>
      <button
        className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md"
        aria-label="Toggle theme"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
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
    </DropdownMenuTrigger>
  )

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {shortcut ? (
        <ShortcutTooltip shortcut={shortcut} disabled={open}>
          {trigger}
        </ShortcutTooltip>
      ) : (
        trigger
      )}
      <DropdownMenuContent
        align="end"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {themeOptions.map((option) => {
          const isActive = theme === option.value
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setTheme(option.value)}
              className={
                isActive
                  ? "text-accent focus:text-accent bg-accent/10 focus:bg-accent/10"
                  : "text-muted-foreground"
              }
            >
              <option.icon className="h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

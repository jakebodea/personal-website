"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { flushSync } from "react-dom"
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
  align = "start",
}: {
  iconSize?: "sm" | "md"
  shortcut?: string
  align?: "start" | "end"
}) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const triggerRectRef = useRef<DOMRect | null>(null)

  // Capture button position on pointer down, before dropdown interaction moves things
  const capturePosition = useCallback(() => {
    if (triggerRef.current) {
      triggerRectRef.current = triggerRef.current.getBoundingClientRect()
    }
  }, [])

  const setThemeWithTransition = useCallback(
    (newTheme: string) => {
      const supportsViewTransition =
        typeof document !== "undefined" &&
        "startViewTransition" in document

      if (!supportsViewTransition) {
        setTheme(newTheme)
        return
      }

      // Use captured position, fall back to live measurement
      const rect =
        triggerRectRef.current ??
        triggerRef.current?.getBoundingClientRect()

      if (!rect || (rect.x === 0 && rect.y === 0 && rect.width === 0)) {
        setTheme(newTheme)
        return
      }

      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      // Set the circle origin for the CSS mask
      const root = document.documentElement
      root.style.setProperty("--reveal-x", `${x}px`)
      root.style.setProperty("--reveal-y", `${y}px`)

      const transition = (document as any).startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme)
        })
      })

      transition.ready
        .then(() => {
          root.animate(
            { "--reveal-size": [`0px`, `${endRadius + 80}px`] },
            {
              duration: 350,
              easing: "ease-out",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            },
          )
        })
        .catch(() => {})

      // Clear captured position after use
      triggerRectRef.current = null
    },
    [setTheme],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // 't' keyboard shortcut for quick toggle (only one instance registers)
  useEffect(() => {
    if (!shortcut) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      if (e.key === "t") {
        setThemeWithTransition(resolvedTheme === "dark" ? "light" : "dark")
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcut, resolvedTheme, setThemeWithTransition])

  // Cleanup leave timer on unmount
  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
    }
  }, [])

  if (!mounted) return null

  const sizeClass = iconSizeClasses[iconSize]

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return
    leaveTimer.current = setTimeout(() => setOpen(false), 100)
  }

  const trigger = (
    <DropdownMenuTrigger asChild>
      <button
        ref={triggerRef}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md"
        aria-label="Toggle theme"
        onPointerDown={capturePosition}
        onPointerEnter={(e) => {
          capturePosition()
          handlePointerEnter(e)
        }}
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
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      {shortcut ? (
        <ShortcutTooltip shortcut={shortcut} disabled={open}>
          {trigger}
        </ShortcutTooltip>
      ) : (
        trigger
      )}
      <DropdownMenuContent
        align={align}
        className="z-[90]"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {themeOptions.map((option) => {
          const isActive = theme === option.value
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setThemeWithTransition(option.value)}
              className={
                isActive
                  ? "text-accent focus:text-accent bg-accent/10 focus:bg-accent/10"
                  : "text-muted-foreground focus:text-foreground focus:bg-muted"
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

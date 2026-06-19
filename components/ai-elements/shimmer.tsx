"use client"

import { motion } from "framer-motion"
import type { ElementType } from "react"
import { memo } from "react"

import { cn } from "@/lib/utils"

type ShimmerProps = {
  as?: ElementType
  children?: string
  className?: string
  duration?: number
  spread?: number
}

export const Shimmer = memo(function Shimmer({
  as: Component = "p",
  children = "",
  className,
  duration = 2,
  spread,
}: ShimmerProps) {
  const calculatedSpread = spread ?? Math.max(children.length * 2, 36)

  return (
    <Component
      className={cn(
        "relative inline-block overflow-hidden text-transparent",
        className
      )}
    >
      <span className="bg-[linear-gradient(110deg,hsl(var(--muted-foreground)/0.42),hsl(var(--foreground)/0.92),hsl(var(--muted-foreground)/0.42))] bg-clip-text">
        {children}
      </span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,hsl(var(--background)/0.85),transparent)]"
        initial={{ x: `-${calculatedSpread}%` }}
        animate={{ x: `${calculatedSpread}%` }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </Component>
  )
})

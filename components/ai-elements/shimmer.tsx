"use client"

import type { CSSProperties, ElementType } from "react"
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
  const style = {
    "--shimmer-duration": `${duration}s`,
    "--shimmer-spread": `${calculatedSpread}%`,
  } as CSSProperties

  return (
    <Component
      className={cn(
        "shimmer-text inline-block text-transparent",
        className
      )}
      style={style}
    >
      {children}
    </Component>
  )
})

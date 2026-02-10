"use client"

import { useEffect, useRef, useState } from "react"
import { PageTitle } from "@/components/layout/page-title"
import { useStickyTitle } from "@/components/providers/sticky-title-provider"
import { cn } from "@/lib/utils"

interface PageWrapperProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  const { setHasStickyTitle } = useStickyTitle()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    setHasStickyTitle(true)
    return () => setHasStickyTitle(false)
  }, [setHasStickyTitle])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-4xl px-6 py-8">
        <div ref={sentinelRef} className="h-0" />
        <div className={cn(
          "relative sticky top-0 z-50 bg-background -mx-6 px-6 h-14 lg:h-20 flex items-center",
          isStuck && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-16 after:translate-y-full after:bg-gradient-to-b after:from-background after:to-transparent after:pointer-events-none"
        )}>
          <PageTitle variant="page" className="!m-0">{title}</PageTitle>
        </div>
        {subtitle && (
          <p className="text-lg text-muted-foreground mb-3">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  )
}

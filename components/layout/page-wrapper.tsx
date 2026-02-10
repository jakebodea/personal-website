"use client"

import { useEffect } from "react"
import { PageTitle } from "@/components/layout/page-title"
import { useStickyTitle } from "@/components/providers/sticky-title-provider"

interface PageWrapperProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  const { setHasStickyTitle } = useStickyTitle()

  useEffect(() => {
    setHasStickyTitle(true)
    return () => setHasStickyTitle(false)
  }, [setHasStickyTitle])

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-4xl px-6 py-8">
        <div className="sticky top-0 z-50 bg-background -mx-6 px-6 h-14 lg:h-20 flex items-center">
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

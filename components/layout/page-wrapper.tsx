"use client"

import { PageTitle } from "@/components/layout/page-title"

interface PageWrapperProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-4xl px-6 py-8">
        <div className="sticky top-0 z-50 bg-background -mx-6 px-6 h-14 flex items-center">
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

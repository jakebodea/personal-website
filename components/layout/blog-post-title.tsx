"use client"

import { PageTitle } from "./page-title"

interface BlogPostTitleProps {
  children: string
  className?: string
}

export function BlogPostTitle({ children, className }: BlogPostTitleProps) {
  return (
    <PageTitle className={className}>
      {children}
    </PageTitle>
  )
}

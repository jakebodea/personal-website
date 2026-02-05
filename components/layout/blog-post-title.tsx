"use client"

import { PageTitle } from "./page-title"

interface BlogPostTitleProps {
  children: string
}

export function BlogPostTitle({ children }: BlogPostTitleProps) {
  return (
    <PageTitle variant="blog">
      {children}
    </PageTitle>
  )
}

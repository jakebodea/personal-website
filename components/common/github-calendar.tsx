"use client"

import { useState, useEffect } from "react"
import { GitHubCalendar } from "react-github-calendar"

export function GithubContributions() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        many of my company projects are under NDA and can&apos;t be shown here,
        but my github contribution calendar gives an idea of my output.
      </p>
      <a href="https://github.com/jakebodea" target="_blank" rel="noopener noreferrer" className="block overflow-x-auto">
        {mounted && <GitHubCalendar username="jakebodea" colorScheme="dark" />}
      </a>
    </div>
  )
}

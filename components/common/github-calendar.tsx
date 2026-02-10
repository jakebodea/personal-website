"use client"

import { GitHubCalendar } from "react-github-calendar"

export function GithubContributions() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        many of my company projects are under NDA and can&apos;t be shown here,
        but my github contribution calendar gives an idea of my output.
      </p>
      <a href="https://github.com/jakebodea" target="_blank" rel="noopener noreferrer" className="block overflow-x-auto">
        <GitHubCalendar username="jakebodea" colorScheme="dark" />
      </a>
    </div>
  )
}

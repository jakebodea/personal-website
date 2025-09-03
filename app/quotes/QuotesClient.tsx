'use client'

import { QuoteData } from '@/lib/quotes'
import { useState, useEffect, useMemo } from 'react'
import SearchBar from './components/SearchBar'
import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function renderBasicMarkdown(text: string): ReactNode[] {
  const linkRegex = /\[([^\[\]]+)\]\((https?:\/\/[^\s)]+)\)/g
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let linkMatch: RegExpExecArray | null

  while ((linkMatch = linkRegex.exec(text)) !== null) {
    if (linkMatch.index > lastIndex) {
      nodes.push(...parseEmphasisAndAutoLinks(text.slice(lastIndex, linkMatch.index)))
    }

    const linkText = linkMatch[1]
    const href = linkMatch[2]
    nodes.push(
      <a
        key={`a-${linkMatch.index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-1 underline-offset-2 decoration-current hover:decoration-primary hover:text-primary transition-colors"
      >
        {parseEmphasisAndAutoLinks(linkText)}
      </a>
    )

    lastIndex = linkRegex.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(...parseEmphasisAndAutoLinks(text.slice(lastIndex)))
  }

  return nodes
}

function parseEmphasisAndAutoLinks(text: string): ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const nodes: ReactNode[] = []
  let lastIndex = 0
  const emphasisRegex = /(\*\*|__)([\s\S]+?)\1|(\*|_)([\s\S]+?)\3/g
  let match: RegExpExecArray | null

  while ((match = emphasisRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      nodes.push(
        <strong className="font-semibold" key={`b-${match.index}`}>
          {parseEmphasisAndAutoLinks(match[2])}
        </strong>
      )
    } else if (match[3]) {
      nodes.push(
        <em className="italic" key={`i-${match.index}`}>
          {parseEmphasisAndAutoLinks(match[4])}
        </em>
      )
    }

    lastIndex = emphasisRegex.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  const withLinks: ReactNode[] = []
  nodes.forEach((node, i) => {
    if (typeof node === 'string') {
      const str = node
      let strLast = 0
      let urlMatch: RegExpExecArray | null
      while ((urlMatch = urlRegex.exec(str)) !== null) {
        if (urlMatch.index > strLast) {
          withLinks.push(str.slice(strLast, urlMatch.index))
        }
        const href = urlMatch[1]
        withLinks.push(
          <a
            key={`auto-a-${i}-${urlMatch.index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-1 underline-offset-2 decoration-current hover:decoration-primary hover:text-primary transition-colors"
          >
            {href}
          </a>
        )
        strLast = urlRegex.lastIndex
      }
      if (strLast < str.length) {
        withLinks.push(str.slice(strLast))
      }
    } else {
      withLinks.push(node)
    }
  })

  const withBreaks: ReactNode[] = []
  withLinks.forEach((node, i) => {
    if (typeof node === 'string') {
      const parts = node.split('\n')
      parts.forEach((part, j) => {
        withBreaks.push(part)
        if (j < parts.length - 1) {
          withBreaks.push(<br key={`br-${i}-${j}`} />)
        }
      })
    } else {
      withBreaks.push(node)
    }
  })

  return withBreaks
}

interface QuotesPageProps {
  initialQuotes: QuoteData[]
}

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default function QuotesPageClient({ initialQuotes }: QuotesPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [baseQuotes, setBaseQuotes] = useState(initialQuotes)
  const [isReady, setIsReady] = useState(false)

  // Shuffle once on client after mount to avoid SSR hydration mismatch
  useEffect(() => {
    setBaseQuotes(shuffle([...initialQuotes]))
    setIsReady(true)
  }, [initialQuotes])

  const filteredQuotes = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    if (!term) return baseQuotes
    return baseQuotes.filter((quote) => {
      const quoteMatch = quote.quote.toLowerCase().includes(term)
      const authorMatch = quote.author.toLowerCase().includes(term)
      return quoteMatch || authorMatch
    })
  }, [searchQuery, baseQuotes])

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">Quotes</h1>
        <p className="text-lg text-muted-foreground mb-10 font-light">
          A collection of quotes and sources that have inspired me.
        </p>
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className="space-y-8">
          {!isReady ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`s-${i}`} className="border-l-4 border-primary/30 pl-6 py-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : (
            <>
              {filteredQuotes.map((quote) => (
                <div key={`${quote.author}|${quote.quote}`} className="border-l-4 border-primary/30 pl-6 py-2">
                  <blockquote className="text-3xl font-serif font-normal text-muted-foreground mb-2 whitespace-pre-wrap" style={{ tabSize: 4 }}>
                    {renderBasicMarkdown(quote.quote)}
                  </blockquote>
                  <cite className="text-md font-sans text-muted-foreground font-light">
                    — {renderBasicMarkdown(quote.author)}
                  </cite>
                </div>
              ))}
              {filteredQuotes.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No quotes found matching &ldquo;{searchQuery}&rdquo;
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 
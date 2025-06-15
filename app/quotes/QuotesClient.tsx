'use client'

import { QuoteData } from '@/lib/quotes'
import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'

interface QuotesPageProps {
  initialQuotes: QuoteData[]
}

export default function QuotesPageClient({ initialQuotes }: QuotesPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredQuotes, setFilteredQuotes] = useState(initialQuotes)

  useEffect(() => {
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase()
      const filtered = initialQuotes.filter((quote) => {
        const quoteMatch = quote.quote.toLowerCase().includes(searchTerm)
        const authorMatch = quote.author.toLowerCase().includes(searchTerm)
        return quoteMatch || authorMatch
      })
      setFilteredQuotes(filtered)
    } else {
      setFilteredQuotes(initialQuotes)
    }
  }, [searchQuery, initialQuotes])

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">Quotes</h1>
        <p className="text-lg text-muted-foreground mb-10 font-light">
          A collection of quotes and sources that have inspired me thus far
        </p>
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className="space-y-8">
          {filteredQuotes.map((quote, index) => (
            <div key={index} className="border-l-4 border-primary/30 pl-6 py-2">
              <blockquote className="text-3xl font-serif font-normal text-muted-foreground mb-2">
                "{quote.quote}"
              </blockquote>
              <cite className="text-md font-sans text-muted-foreground font-light">
                — {quote.author}
              </cite>
            </div>
          ))}
          
          {filteredQuotes.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No quotes found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
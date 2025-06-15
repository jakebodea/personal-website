import { quotesData } from '@/content/quotes-data'

export interface QuoteData {
  quote: string
  author: string
}


export function getAllQuotes(): QuoteData[] {
  return quotesData
}

export function searchQuotes(query: string): QuoteData[] {
  if (!query.trim()) {
    return getAllQuotes()
  }

  const searchTerm = query.toLowerCase()
  
  return getAllQuotes().filter((quote) => {
    const quoteMatch = quote.quote.toLowerCase().includes(searchTerm)
    const authorMatch = quote.author.toLowerCase().includes(searchTerm)
    return quoteMatch || authorMatch
  })
} 
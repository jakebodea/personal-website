import fs from 'fs'
import path from 'path'

export interface QuoteData {
  quote: string
  author: string
}

const QUOTES_FILE = path.join(process.cwd(), 'content', 'quotes.json')

export function getAllQuotes(): QuoteData[] {
  try {
    const raw = fs.readFileSync(QUOTES_FILE, 'utf8')
    const quotes = JSON.parse(raw) as QuoteData[]
    return quotes
  } catch (error) {
    console.error('Error reading quotes file:', error)
    return []
  }
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
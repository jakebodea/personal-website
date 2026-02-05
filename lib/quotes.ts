import { getQuotesFromNotion } from './notion'

export interface QuoteData {
  quote: string
  author: string
}

export async function getAllQuotes(): Promise<QuoteData[]> {
  return await getQuotesFromNotion()
}

export async function searchQuotes(query: string): Promise<QuoteData[]> {
  const allQuotes = await getAllQuotes()
  
  if (!query.trim()) {
    return allQuotes
  }

  const searchTerm = query.toLowerCase()
  
  return allQuotes.filter((quote) => {
    const quoteMatch = quote.quote.toLowerCase().includes(searchTerm)
    const authorMatch = quote.author.toLowerCase().includes(searchTerm)
    return quoteMatch || authorMatch
  })
} 
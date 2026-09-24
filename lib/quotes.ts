import { getQuotesFromNotion } from './notion'

export interface QuoteData {
  quote: string
  author: string
}

export async function getAllQuotes(): Promise<QuoteData[]> {
  const cacheKey = 'https://jakebodea.com/__internal/quotes-v1'
  const cache = (caches as CacheStorage & { default: Cache }).default
  const cached = await cache.match(cacheKey)
  if (cached) return cached.json<QuoteData[]>()

  const quotes = await getQuotesFromNotion()
  await cache.put(cacheKey, Response.json(quotes, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  }))
  return quotes
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

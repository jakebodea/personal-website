import { getAllQuotes } from '@/lib/quotes'
import QuotesPageClient from './QuotesClient'

// Add revalidation to cache the page for 1 hour (3600 seconds)
export const revalidate = 3600

export default async function QuotesPage() {
  const quotes = await getAllQuotes()
  return <QuotesPageClient initialQuotes={quotes} />
} 
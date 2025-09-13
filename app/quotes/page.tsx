import { getAllQuotes } from '@/lib/quotes'
import QuotesPageClient from './QuotesClient'

export default async function QuotesPage() {
  const quotes = await getAllQuotes()
  return <QuotesPageClient initialQuotes={quotes} />
} 
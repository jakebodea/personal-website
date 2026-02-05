import { getAllQuotes } from '@/lib/quotes'
import QuotesPageClient from './quotes-client'

export const dynamic = 'force-dynamic'

export default async function QuotesPage() {
  const quotes = await getAllQuotes()
  return <QuotesPageClient initialQuotes={quotes} />
} 
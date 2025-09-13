import { getAllQuotes } from '@/lib/quotes'
import QuotesPageClient from './QuotesClient'

// Add revalidation to cache the page for 1 hour (3600 seconds)
export const revalidate = 3600

export default async function QuotesPage() {
  console.log('📖 Quotes page loading...')
  const quotes = await getAllQuotes()
  console.log('📚 Quotes loaded in page component:', quotes.length, 'quotes')
  
  return <QuotesPageClient initialQuotes={quotes} />
} 
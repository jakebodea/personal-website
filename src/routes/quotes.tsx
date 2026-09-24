import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import QuotesPageClient from '@/src/pages/quotes-client'
import type { QuoteData } from '@/lib/quotes'

const getQuotes = createServerFn().handler(async (): Promise<QuoteData[]> => {
  const { getAllQuotes } = await import('@/lib/quotes')
  return getAllQuotes()
})

export const Route = createFileRoute('/quotes')({
  loader: () => getQuotes(),
  component: QuotesPage,
})

function QuotesPage() {
  return <QuotesPageClient initialQuotes={Route.useLoaderData()} />
}

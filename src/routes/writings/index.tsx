import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import WritingsPageClient from '@/src/pages/writings-client'
import type { Writing } from '@/lib/writings'

const getWritings = createServerFn().handler(async (): Promise<Writing[]> => {
  const { getAllWritings } = await import('@/lib/writings')
  return getAllWritings()
})

export const Route = createFileRoute('/writings/')({
  loader: () => getWritings(),
  component: WritingsPage,
})

function WritingsPage() {
  return <WritingsPageClient initialWritings={Route.useLoaderData()} />
}

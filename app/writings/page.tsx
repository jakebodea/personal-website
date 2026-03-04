import { getAllWritings } from '@/lib/writings'
import WritingsPageClient from './writings-client'

export default async function WritingsPage() {
  const writings = getAllWritings()

  return <WritingsPageClient initialWritings={writings} />
}

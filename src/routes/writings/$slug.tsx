import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import WritingPage from '@/src/pages/writing'
import type { BlogWriting } from '@/lib/writings'

const getWriting = createServerFn()
  .validator((slug: string) => slug)
  .handler(async ({ data }): Promise<BlogWriting | null> => {
    const { getBlogWriting } = await import('@/lib/writings')
    return getBlogWriting(data)
  })

export const Route = createFileRoute('/writings/$slug')({
  loader: ({ params }) => getWriting({ data: params.slug }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.title} | jake bodea` : 'writing | jake bodea' }, { name: 'description', content: loaderData ? `${loaderData.title} - Writing by Jake Bodea` : 'Writing by Jake Bodea' }] }),
  component: WritingRoute,
})

function WritingRoute() {
  const writing = Route.useLoaderData()
  return writing ? <WritingPage writing={writing} /> : <div>Writing not found.</div>
}

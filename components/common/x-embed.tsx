import { Tweet } from 'react-tweet'

interface XEmbedProps {
  url: string
}

function extractTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/)
  return match?.[1] ?? null
}

export function XEmbed({ url }: XEmbedProps) {
  const tweetId = extractTweetId(url)
  if (!tweetId) return null

  return (
    <div className="mt-4 flex justify-center [&>div]:!m-0">
      <Tweet id={tweetId} />
    </div>
  )
}

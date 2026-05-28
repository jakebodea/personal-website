import { EmbeddedTweet } from 'react-tweet'
import { getTweet } from 'react-tweet/api'

interface XEmbedProps {
  url: string
}

function extractTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/)
  return match?.[1] ?? null
}

type TweetWithEntities = {
  entities?: {
    hashtags?: unknown[]
    urls?: unknown[]
    symbols?: unknown[]
    user_mentions?: unknown[]
    media?: unknown[]
  }
  quoted_tweet?: TweetWithEntities
}

function normalizeTweetEntities<T extends TweetWithEntities>(tweet: T): T {
  tweet.entities ??= {
    hashtags: [],
    urls: [],
    symbols: [],
    user_mentions: [],
  }
  tweet.entities.hashtags ??= []
  tweet.entities.urls ??= []
  tweet.entities.symbols ??= []
  tweet.entities.user_mentions ??= []

  if (tweet.quoted_tweet) {
    normalizeTweetEntities(tweet.quoted_tweet)
  }

  return tweet
}

export async function XEmbed({ url }: XEmbedProps) {
  const tweetId = extractTweetId(url)
  if (!tweetId) return null

  const rawTweet = await getTweet(tweetId).catch(() => null)
  if (!rawTweet) return null

  const tweet = normalizeTweetEntities(rawTweet)

  return (
    <div className="mt-4 flex justify-center [&>div]:!m-0">
      <EmbeddedTweet tweet={tweet} />
    </div>
  )
}

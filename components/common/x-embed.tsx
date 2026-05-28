"use client"

import { useEffect, useState } from 'react'
import { EmbeddedTweet } from 'react-tweet'
import { getTweet } from 'react-tweet/api'
import type { Tweet } from 'react-tweet/api'

interface XEmbedProps {
  url: string
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

function extractTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/)
  return match?.[1] ?? null
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

export function XEmbed({ url }: XEmbedProps) {
  const tweetId = extractTweetId(url)
  const [tweet, setTweet] = useState<Tweet | null>(null)

  useEffect(() => {
    if (!tweetId) return

    getTweet(tweetId)
      .then((rawTweet) => {
        if (!rawTweet) return
        setTweet(normalizeTweetEntities(rawTweet))
      })
      .catch(() => {})
  }, [tweetId])

  if (!tweetId || !tweet) return null

  return (
    <div className="mt-4 flex justify-center [&>div]:!m-0">
      <EmbeddedTweet tweet={tweet} />
    </div>
  )
}

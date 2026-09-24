"use client";

import { useEffect, useState } from "react";
import { EmbeddedTweet } from "react-tweet";
import { getTweet } from "react-tweet/api";
import type { Tweet } from "react-tweet/api";

interface XEmbedProps {
  url: string;
}

interface TweetWithEntities {
  entities?: {
    hashtags?: unknown[];
    urls?: unknown[];
    symbols?: unknown[];
    user_mentions?: unknown[];
    media?: unknown[];
  };
  quoted_tweet?: TweetWithEntities;
}

const TWEET_ID_PATTERN = /status\/(?<tweetId>\d+)/u;

const extractTweetId = (url: string): string | null => {
  const match = TWEET_ID_PATTERN.exec(url);
  return match?.groups?.tweetId ?? null;
};

const normalizeTweetEntities = <T extends TweetWithEntities>(tweet: T): T => {
  tweet.entities ??= {
    hashtags: [],
    urls: [],
    symbols: [],
    user_mentions: [],
  };
  tweet.entities.hashtags ??= [];
  tweet.entities.urls ??= [];
  tweet.entities.symbols ??= [];
  tweet.entities.user_mentions ??= [];

  if (tweet.quoted_tweet !== undefined) {
    normalizeTweetEntities(tweet.quoted_tweet);
  }

  return tweet;
};

export const XEmbed = ({ url }: XEmbedProps) => {
  const tweetId = extractTweetId(url);
  const [tweet, setTweet] = useState<Tweet | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (tweetId !== null && tweetId !== "") {
      void (async () => {
        try {
          const rawTweet = await getTweet(tweetId);
          if (rawTweet === undefined || cancelled) {
            return;
          }
          setTweet(normalizeTweetEntities(rawTweet));
        } catch {
          // Tweet fetch failed; keep the embed hidden.
        }
      })();
    }

    return () => {
      cancelled = true;
    };
  }, [tweetId]);

  if (tweetId === null || tweetId === "" || tweet === null) {
    return null;
  }

  return (
    <div className="mt-4 flex justify-center [&>div]:!m-0">
      <EmbeddedTweet tweet={tweet} />
    </div>
  );
};

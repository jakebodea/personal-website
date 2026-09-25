import { getQuotesFromNotion } from "./notion";

export interface QuoteData {
  quote: string;
  author: string;
}

const QUOTES_CACHE_KEY = "https://jakebodea.com/__internal/quotes-v1";
const QUOTES_CACHE_CONTROL = "public, max-age=3600";
const STRING_TAG = "[object String]";

interface CloudflareCacheStorage {
  readonly default: Cache;
  open: (cacheName: string) => Promise<Cache>;
}

const isStringValue = (value: unknown): value is string =>
  Object.prototype.toString.call(value) === STRING_TAG;

const isCache = (value: unknown): value is Cache => {
  if (value === null || value === undefined) {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  if (!(value instanceof Object)) {
    return false;
  }
  return "match" in value && "put" in value && "delete" in value;
};

const isCloudflareCacheStorage = (
  value: unknown
): value is CloudflareCacheStorage => {
  if (value === null || value === undefined) {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  if (!(value instanceof Object)) {
    return false;
  }
  if (!("default" in value)) {
    return false;
  }
  return isCache(value.default);
};

const isQuoteData = (value: unknown): value is QuoteData => {
  if (value === null || value === undefined || Array.isArray(value)) {
    return false;
  }
  if (!(value instanceof Object)) {
    return false;
  }
  if (!("quote" in value) || !("author" in value)) {
    return false;
  }
  const { quote, author } = value;
  return isStringValue(quote) && isStringValue(author);
};

const isQuoteList = (value: unknown): value is QuoteData[] => {
  if (!Array.isArray(value)) {
    return false;
  }
  for (const item of value) {
    if (!isQuoteData(item)) {
      return false;
    }
  }
  return true;
};

const getCloudflareDefaultCache = (): Cache => {
  if (!isCloudflareCacheStorage(caches)) {
    throw new Error("Cloudflare default cache is unavailable");
  }
  return caches.default;
};

export const getAllQuotes = async (): Promise<QuoteData[]> => {
  const cache = getCloudflareDefaultCache();
  const cached = await cache.match(QUOTES_CACHE_KEY);
  if (cached !== undefined) {
    const payload: unknown = await cached.json();
    if (isQuoteList(payload)) {
      return payload;
    }
  }

  const quotes = await getQuotesFromNotion();
  await cache.put(
    QUOTES_CACHE_KEY,
    Response.json(quotes, {
      headers: { "Cache-Control": QUOTES_CACHE_CONTROL },
    })
  );
  return quotes;
};

export const searchQuotes = async (query: string): Promise<QuoteData[]> => {
  const allQuotes = await getAllQuotes();

  if (query.trim() === "") {
    return allQuotes;
  }

  const searchTerm = query.toLowerCase();

  return allQuotes.filter((quote) => {
    const quoteMatch = quote.quote.toLowerCase().includes(searchTerm);
    const authorMatch = quote.author.toLowerCase().includes(searchTerm);
    return quoteMatch || authorMatch;
  });
};

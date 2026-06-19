import { APICallError } from "ai"

export const CHAT_RATE_LIMIT_ERROR_CODE = "CHAT_RATE_LIMIT_BACKLOG"
export const CHAT_LOCAL_RATE_LIMIT_ERROR_CODE = "CHAT_RATE_LIMITED"

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 12

const requestBuckets = new Map<string, { count: number; resetAt: number }>()

export function getChatClientId(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for")
  const realIp = req.headers.get("x-real-ip")

  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown"
}

export function isChatRequestAllowed(clientId: string) {
  const now = Date.now()
  const bucket = requestBuckets.get(clientId)

  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(clientId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return true
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  bucket.count += 1
  return true
}

export function isChatRateLimitError(error: unknown) {
  if (
    APICallError.isInstance(error) &&
    error.statusCode === 429
  ) {
    return true
  }

  if (typeof error === "object" && error !== null) {
    const maybeStatusCode = "statusCode" in error ? error.statusCode : null
    const maybeStatus = "status" in error ? error.status : null
    if (maybeStatusCode === 429 || maybeStatus === 429) return true
  }

  if (!(error instanceof Error)) return false

  return (
    error.message.includes("429") &&
    /rate limit|too many requests/i.test(error.message)
  )
}

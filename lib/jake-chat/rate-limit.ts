import { APICallError } from "ai"

export const GROQ_RATE_LIMIT_ERROR_CODE = "GROQ_RATE_LIMIT_BACKLOG"

export function isGroqRateLimitError(error: unknown) {
  if (
    APICallError.isInstance(error) &&
    error.statusCode === 429 &&
    /groq|api\.groq\.com/i.test(
      `${error.url} ${error.message} ${error.responseBody ?? ""}`
    )
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
    /groq|rate limit|too many requests/i.test(error.message)
  )
}

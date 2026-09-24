import { APICallError } from "ai";

export const CHAT_RATE_LIMIT_ERROR_CODE = "CHAT_RATE_LIMIT_BACKLOG";
export const CHAT_LOCAL_RATE_LIMIT_ERROR_CODE = "CHAT_RATE_LIMITED";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;

const requestBuckets = new Map<string, { count: number; resetAt: number }>();

export type ChatApiError = APICallError | Error;

export const getChatClientId = (req: Request) => {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const forwardedClient =
    forwardedFor?.split(",")[0]?.trim() ?? realIp ?? "unknown";

  return forwardedClient.length > 0 ? forwardedClient : "unknown";
};

export const isChatRequestAllowed = (clientId: string) => {
  const now = Date.now();
  const bucket = requestBuckets.get(clientId);

  if (bucket === undefined || bucket.resetAt <= now) {
    requestBuckets.set(clientId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  bucket.count += 1;
  return true;
};

export const isChatRateLimitError = (error: ChatApiError) => {
  if (APICallError.isInstance(error) && error.statusCode === 429) {
    return true;
  }

  if (error instanceof Error) {
    return (
      error.message.includes("429") &&
      /rate limit|too many requests/iu.test(error.message)
    );
  }

  return false;
};

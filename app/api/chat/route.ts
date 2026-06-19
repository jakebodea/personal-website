import { convertToModelMessages, streamText, type UIMessage } from "ai"

import { getJakeChatSystemPrompt } from "@/lib/jake-chat/persona"
import {
  JAKE_CHAT_GATEWAY_OPTIONS,
  JAKE_CHAT_MODEL,
} from "@/lib/jake-chat/model"
import { JAKE_CHAT_PROMPT_CACHE_KEY } from "@/lib/jake-chat/prompt-cache"
import {
  CHAT_RATE_LIMIT_ERROR_CODE,
  isChatRateLimitError,
} from "@/lib/jake-chat/rate-limit"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: JAKE_CHAT_MODEL,
    system: getJakeChatSystemPrompt(),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      gateway: JAKE_CHAT_GATEWAY_OPTIONS,
      openai: {
        promptCacheKey: JAKE_CHAT_PROMPT_CACHE_KEY,
      },
    },
  })

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (isChatRateLimitError(error)) {
        return CHAT_RATE_LIMIT_ERROR_CODE
      }

      return "CHAT_RESPONSE_FAILED"
    },
  })
}

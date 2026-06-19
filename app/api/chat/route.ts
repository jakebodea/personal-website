import { convertToModelMessages, streamText, type UIMessage } from "ai"

import { getJakeChatSystemPrompt } from "@/lib/jake-chat/persona"
import {
  CHAT_RATE_LIMIT_ERROR_CODE,
  isChatRateLimitError,
} from "@/lib/jake-chat/rate-limit"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "openai/gpt-oss-120b",
    system: getJakeChatSystemPrompt(),
    messages: await convertToModelMessages(messages),
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

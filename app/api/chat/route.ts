import { groq, type GroqLanguageModelOptions } from "@ai-sdk/groq"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

import { getJakeChatSystemPrompt } from "@/lib/jake-chat/persona"
import {
  GROQ_RATE_LIMIT_ERROR_CODE,
  isGroqRateLimitError,
} from "@/lib/jake-chat/rate-limit"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: groq("openai/gpt-oss-120b"),
    system: getJakeChatSystemPrompt(),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      groq: {
        reasoningEffort: "medium",
        reasoningFormat: "hidden",
      } satisfies GroqLanguageModelOptions,
    },
  })

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (isGroqRateLimitError(error)) {
        return GROQ_RATE_LIMIT_ERROR_CODE
      }

      return "CHAT_RESPONSE_FAILED"
    },
  })
}

import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { createWorkersAI } from 'workers-ai-provider'

import { getJakeChatSystemPrompt } from "@/lib/jake-chat/persona"
import { JAKE_CHAT_MODEL } from "@/lib/jake-chat/model"
import { getBoundedChatMessages } from "@/lib/jake-chat/request"
import {
  CHAT_RATE_LIMIT_ERROR_CODE,
  CHAT_LOCAL_RATE_LIMIT_ERROR_CODE,
  getChatClientId,
  isChatRequestAllowed,
  isChatRateLimitError,
} from "@/lib/jake-chat/rate-limit"

export const Route = createFileRoute('/api/chat/')({
  server: { handlers: { POST: ({ request }) => postChat(request) } },
})

async function postChat(req: Request) {
  const clientId = getChatClientId(req)
  if (!isChatRequestAllowed(clientId)) {
    return new Response(CHAT_LOCAL_RATE_LIMIT_ERROR_CODE, { status: 429 })
  }

  const messages: UIMessage[] = await getBoundedChatMessages(req)
  const workersai = createWorkersAI({ binding: env.AI })

  const result = streamText({
    model: workersai(JAKE_CHAT_MODEL, { reasoning_effort: 'low' }),
    maxOutputTokens: 1200,
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

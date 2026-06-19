import { groq } from "@ai-sdk/groq"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

import { getJakeChatSystemPrompt } from "@/lib/jake-chat/persona"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: groq("openai/gpt-oss-120b"),
    system: getJakeChatSystemPrompt(),
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}

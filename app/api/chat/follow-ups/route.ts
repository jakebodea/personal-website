import { generateText, Output, type UIMessage } from "ai"
import { z } from "zod"

import { fallbackFollowUps } from "@/lib/jake-chat/follow-ups"
import { isChatRateLimitError } from "@/lib/jake-chat/rate-limit"

export const maxDuration = 30

const followUpSystemPrompt = `
generate the next follow-up controls for a personal-site chat.

your only job is to help the visitor continue the current conversation.
use only the recent conversation provided. do not rely on outside context.

rules:
- return 3 to 5 follow-ups.
- pill titles should be short but understandable on their own, usually 2 to 4 words.
- do not use vague one-word titles like "example", "tools", "technique", "more", "details", or "why".
- prompts must be complete user-visible questions.
- use second person when addressing the site proxy, e.g. "what are you building?".
- avoid generic advice prompts.
- prefer follow-ups that naturally deepen, compare, clarify, or branch from the last assistant answer.
- use "button" for direct follow-ups and "select" when a small set of choices is natural.
- choose whatever mix of types best fits the conversation. you do not need to include every type.
- most of the time, simple "button" follow-ups are enough.
- only use "select" when the choices are obvious and human-readable, like specific projects, jobs, topics, or time periods. the select title must name the category, e.g. "pick a project", not "topic".
- every "select" promptTemplate must include the literal placeholder {{value}} exactly once.
- write promptTemplate as the full visible message that should be sent after replacing {{value}}.
- avoid meta follow-ups about the answer itself unless they are clearly useful. prefer visitor-friendly questions.
- never generate "ask your own" or equivalent. the main chat input already handles arbitrary questions.
- good examples: "how do you teach?", "what did that change?", "show another example", "pick a project".
- bad examples: "example", "tools", "technique", "explain chain rule".
- all text should be lowercase except proper nouns, acronyms, and code identifiers.
`.trim()

const shortText = z.string().min(3).max(36)
const promptText = z.string().min(12).max(180)

const followUpSchema = z.object({
  followUps: z
    .array(
      z.discriminatedUnion("type", [
        z.object({
          id: z.string(),
          type: z.literal("button"),
          title: shortText,
          prompt: promptText,
        }),
        z.object({
          id: z.string(),
          type: z.literal("select"),
          title: shortText,
          promptTemplate: promptText,
          options: z.array(
            z.object({
              label: shortText,
              value: z.string().min(1).max(80),
            })
          ).min(2).max(5),
          customLabel: shortText.nullable(),
        }),
      ])
    )
    .min(3)
    .max(5),
})

function getMessageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim()
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()
  const recentMessages = messages.slice(-6).map((message) => ({
    role: message.role,
    text: getMessageText(message),
  }))

  try {
    const result = await generateText({
      model: "openai/gpt-oss-120b",
      system: followUpSystemPrompt,
      prompt: `conversation so far:\n${JSON.stringify(recentMessages, null, 2)}\n\ngenerate the next follow-up controls.`,
      output: Output.object({ schema: followUpSchema }),
    })

    return Response.json(result.output)
  } catch (error) {
    if (isChatRateLimitError(error)) {
      return Response.json({ followUps: fallbackFollowUps }, { status: 202 })
    }

    throw error
  }
}

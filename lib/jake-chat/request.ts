import type { UIMessage } from "ai"

const MAX_MESSAGES = 12
const MAX_TEXT_CHARS = 2_000

function normalizeMessage(message: UIMessage): UIMessage {
  return {
    ...message,
    parts: message.parts.map((part) => {
      if (part.type !== "text") return part

      return {
        ...part,
        text: part.text.slice(0, MAX_TEXT_CHARS),
      }
    }),
  }
}

export async function getBoundedChatMessages(req: Request) {
  const { messages }: { messages?: UIMessage[] } = await req.json()

  if (!Array.isArray(messages)) {
    return []
  }

  return messages.slice(-MAX_MESSAGES).map(normalizeMessage)
}

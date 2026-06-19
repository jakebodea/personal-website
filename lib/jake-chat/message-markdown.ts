import type { UIMessage } from "ai"

export function getMessageMarkdown(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim()
}

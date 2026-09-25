import type { UIMessage } from "ai";

export const getMessageMarkdown = (message: UIMessage) =>
  message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();

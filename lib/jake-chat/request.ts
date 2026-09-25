import type { UIMessage } from "ai";

const MAX_MESSAGES = 12;
const MAX_TEXT_CHARS = 2000;

const normalizeMessage = (message: UIMessage): UIMessage => ({
  ...message,
  parts: message.parts.map((part) => {
    if (part.type !== "text") {
      return part;
    }

    return {
      ...part,
      text: part.text.slice(0, MAX_TEXT_CHARS),
    };
  }),
});

export const getBoundedChatMessages = async (req: Request) => {
  const { messages }: { messages?: UIMessage[] } = await req.json();

  if (!Array.isArray(messages)) {
    return [];
  }

  return messages.slice(-MAX_MESSAGES).map(normalizeMessage);
};

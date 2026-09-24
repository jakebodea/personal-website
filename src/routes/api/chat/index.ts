import { createFileRoute } from "@tanstack/react-router";
import { APICallError, convertToModelMessages, streamText } from "ai";
import type { UIMessage } from "ai";
import { env } from "cloudflare:workers";
import { createWorkersAI } from "workers-ai-provider";

import { JAKE_CHAT_MODEL } from "@/lib/jake-chat/model";
import { getJakeChatSystemPrompt } from "@/lib/jake-chat/persona";
import {
  CHAT_RATE_LIMIT_ERROR_CODE,
  CHAT_LOCAL_RATE_LIMIT_ERROR_CODE,
  getChatClientId,
  isChatRequestAllowed,
  isChatRateLimitError,
} from "@/lib/jake-chat/rate-limit";
import type { ChatApiError } from "@/lib/jake-chat/rate-limit";
import { getBoundedChatMessages } from "@/lib/jake-chat/request";

const handlePostChat = async ({ request }: { request: Request }) =>
  await postChat(request);

export const Route = createFileRoute("/api/chat/")({
  server: {
    handlers: { POST: handlePostChat },
  },
});

const postChat = async (req: Request) => {
  const clientId = getChatClientId(req);
  if (!isChatRequestAllowed(clientId)) {
    return new Response(CHAT_LOCAL_RATE_LIMIT_ERROR_CODE, { status: 429 });
  }

  const messages: UIMessage[] = await getBoundedChatMessages(req);
  const workersai = createWorkersAI({ binding: env.AI });

  const result = streamText({
    model: workersai(JAKE_CHAT_MODEL, { reasoning_effort: "low" }),
    maxOutputTokens: 1200,
    system: getJakeChatSystemPrompt(),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      const chatError: ChatApiError =
        APICallError.isInstance(error) || error instanceof Error
          ? error
          : new Error("chat request failed");

      if (isChatRateLimitError(chatError)) {
        return CHAT_RATE_LIMIT_ERROR_CODE;
      }

      return "CHAT_RESPONSE_FAILED";
    },
  });
};

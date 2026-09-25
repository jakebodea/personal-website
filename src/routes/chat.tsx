import { createFileRoute } from "@tanstack/react-router";

import ChatPage from "@/src/pages/chat";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "chat | jake bodea" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ChatPage,
});

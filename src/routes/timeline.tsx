import { createFileRoute } from "@tanstack/react-router";

import TimelinePage from "@/src/pages/timeline";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "timeline | jake bodea" },
      { name: "description", content: "jake bodea's timeline of experiences" },
    ],
  }),
  component: TimelinePage,
});

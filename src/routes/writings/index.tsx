import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import type { Writing } from "@/lib/writings";
import WritingsPageClient from "@/src/pages/writings-client";

const getWritings = createServerFn().handler(async (): Promise<Writing[]> => {
  const { getAllWritings } = await import("@/lib/writings");
  return getAllWritings();
});

const WritingsPage = () => (
  <WritingsPageClient initialWritings={Route.useLoaderData()} />
);

export const Route = createFileRoute("/writings/")({
  loader: async () => await getWritings(),
  component: WritingsPage,
});

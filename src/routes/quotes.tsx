import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import type { QuoteData } from "@/lib/quotes";
import { QuotesPage } from "@/src/pages/quotes-client";

const getQuotes = createServerFn().handler(async (): Promise<QuoteData[]> => {
  const { getAllQuotes } = await import("@/lib/quotes");
  return await getAllQuotes();
});

const QuotesRoutePage = () => (
  <QuotesPage initialQuotes={Route.useLoaderData()} />
);

export const Route = createFileRoute("/quotes")({
  loader: async () => await getQuotes(),
  component: QuotesRoutePage,
});

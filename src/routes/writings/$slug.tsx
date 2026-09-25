import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import type { BlogWriting } from "@/lib/writings";
import WritingPage from "@/src/pages/writing";

const getWriting = createServerFn()
  .validator((slug: string) => slug)
  .handler(async ({ data }): Promise<BlogWriting | null> => {
    const { getBlogWriting } = await import("@/lib/writings");
    return getBlogWriting(data);
  });

const WritingRoute = () => {
  const writing = Route.useLoaderData();
  if (writing === null) {
    return <div>Writing not found.</div>;
  }
  return <WritingPage writing={writing} />;
};

export const Route = createFileRoute("/writings/$slug")({
  loader: async ({ params }) => await getWriting({ data: params.slug }),
  head: ({ loaderData }) => {
    const writingTitle = loaderData?.title;
    return {
      meta: [
        {
          title:
            writingTitle === undefined
              ? "writing | jake bodea"
              : `${writingTitle} | jake bodea`,
        },
        {
          name: "description",
          content:
            writingTitle === undefined
              ? "Writing by Jake Bodea"
              : `${writingTitle} - Writing by Jake Bodea`,
        },
      ],
    };
  },
  component: WritingRoute,
});

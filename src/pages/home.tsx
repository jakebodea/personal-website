import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import Link from "@/components/common/site-link";
import { PageTitle } from "@/components/layout/page-title";
import { getHomeContent } from "@/lib/home";

const markdownComponents: Components = {
  a: ({ href, children }) => {
    if (href !== undefined && href !== "" && href.startsWith("/")) {
      return (
        <Link
          href={href}
          className="text-accent underline-offset-4 hover:underline"
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline-offset-4 hover:underline"
      >
        {children}
      </a>
    );
  },
  strong: ({ children }) => (
    <strong className="font-medium text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
};

const HomePage = () => {
  const content = getHomeContent();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-start py-16">
      <div className="container mx-auto max-w-2xl px-6">
        <PageTitle>jake bodea</PageTitle>
        <div className="typeset typeset-home text-lg text-muted-foreground md:text-xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import Link from "next/link"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { PageTitle } from "@/components/layout/page-title"
import { getHomeContent } from "@/lib/home"

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 last:mb-0">
      {children}
    </p>
  ),
  a: ({ href, children }) => {
    if (href?.startsWith("/")) {
      return (
        <Link
          href={href}
          className="text-accent hover:underline underline-offset-4"
        >
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:underline underline-offset-4"
      >
        {children}
      </a>
    )
  },
  strong: ({ children }) => (
    <strong className="text-foreground font-medium">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
}

export default function HomePage() {
  const content = getHomeContent()

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center">
      <div className="container max-w-2xl mx-auto px-6 py-12">
        <PageTitle>jake bodea</PageTitle>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

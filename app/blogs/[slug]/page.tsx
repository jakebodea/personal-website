/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBlogSlugs, getBlogData } from '@/lib/blogs'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PageProps {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: PageProps) {
  const { title } = getBlogData(params.slug)
  return {
    title,
    description: `${title} - Blog post by Jake Bodea`,
  }
}

export default function BlogPostPage({ params }: PageProps) {
  const { title, date, content } = getBlogData(params.slug)

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="font-serif font-light text-4xl md:text-5xl text-foreground mb-2">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mb-8 font-sans">
            {new Date(date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} | By Jake Bodea
          </p>
          <ReactMarkdown
            remarkPlugins={[remarkGfm as any]}
            components={{
              h1: ({ className, ...props }: any) => (
                <h1
                  {...props}
                  className={cn(
                    "font-serif text-3xl md:text-4xl lg:text-5xl font-light mt-8 mb-4",
                    className
                  )}
                />
              ),
              h2: ({ className, ...props }: any) => (
                <h2
                  {...props}
                  className={cn(
                    "font-serif text-2xl md:text-3xl lg:text-4xl font-light mt-6 mb-3",
                    className
                  )}
                />
              ),
              h3: ({ className, ...props }: any) => (
                <h3
                  {...props}
                  className={cn(
                    "font-serif text-xl md:text-2xl lg:text-3xl font-light mt-5 mb-2",
                    className
                  )}
                />
              ),
              h4: ({ className, ...props }: any) => (
                <h4
                  {...props}
                  className={cn("font-serif text-lg md:text-xl mt-4 mb-2", className)}
                />
              ),
              h5: ({ className, ...props }: any) => (
                <h5
                  {...props}
                  className={cn("font-serif text-base md:text-lg mt-4 mb-2", className)}
                />
              ),
              h6: ({ className, ...props }: any) => (
                <h6
                  {...props}
                  className={cn("font-serif text-base mt-4 mb-2", className)}
                />
              ),
              p: ({ className, ...props }: any) => (
                <p
                  {...props}
                  className={cn("font-sans leading-relaxed text-[1rem] md:text-[1.05rem]", className)}
                />
              ),
              li: ({ className, ...props }: any) => (
                <li
                  {...props}
                  className={cn("font-sans leading-relaxed", className)}
                />
              ),
              strong: ({ className, ...props }: any) => (
                <strong
                  {...props}
                  className={cn("font-sans font-semibold", className)}
                />
              ),
              em: ({ className, ...props }: any) => (
                <em
                  {...props}
                  className={cn("font-sans italic", className)}
                />
              ),
              del: ({ className, ...props }: any) => (
                <del
                  {...props}
                  className={cn("font-sans", className)}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
} 
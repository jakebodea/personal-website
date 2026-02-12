/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getBlogSlugs, getBlogData } from '@/lib/blogs'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckSquare, Square } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax'
import { CodeBlock } from '@/components/ui/code-block'
import { CopyMarkdownButton } from '@/components/common/copy-markdown-button'
import { BlogPostTitle } from '@/components/layout/blog-post-title'

interface PageProps {
  slug: string
}

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<PageProps> }) {
  const { slug } = await params
  const { title } = getBlogData(slug)
  return {
    title,
    description: `${title} - Blog post by Jake Bodea`,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<PageProps> }) {
  const { slug } = await params
  const { title, date, content } = getBlogData(slug)

  // Check if content has footnotes
  // const hasFootnotes = content.includes('[^') && content.includes(']:')

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-sans text-sm">Back to Blogs</span>
          </Link>
          <CopyMarkdownButton content={content} />
        </div>
        
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <BlogPostTitle>{title}</BlogPostTitle>
          <p className="text-sm text-muted-foreground mb-8 font-sans">
            {new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric', 
              month: 'long',
              day: 'numeric',
            })} | Authored by Jake Bodea
          </p>
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeMathjax as any]}
              components={{
                // Headings
                h1: ({ className, node, ...props }: any) => (
                  <h1
                    {...props}
                    className={cn(
                      "font-serif text-3xl md:text-4xl lg:text-5xl font-light mt-12 mb-6 first:mt-0",
                      className
                    )}
                  />
                ),
                h2: ({ className, node, ...props }: any) => (
                  <h2
                    {...props}
                    className={cn(
                      "font-serif text-2xl md:text-3xl lg:text-4xl font-light mt-10 mb-4",
                      className
                    )}
                  />
                ),
                h3: ({ className, node, ...props }: any) => (
                  <h3
                    {...props}
                    className={cn(
                      "font-serif text-xl md:text-2xl lg:text-3xl font-light mt-8 mb-3",
                      className
                    )}
                  />
                ),
                h4: ({ className, node, ...props }: any) => (
                  <h4
                    {...props}
                    className={cn("font-serif text-lg md:text-xl mt-6 mb-2", className)}
                  />
                ),
                h5: ({ className, node, ...props }: any) => (
                  <h5
                    {...props}
                    className={cn("font-serif text-base md:text-lg mt-6 mb-2", className)}
                  />
                ),
                h6: ({ className, node, ...props }: any) => (
                  <h6
                    {...props}
                    className={cn("font-serif text-base mt-6 mb-2 text-muted-foreground", className)}
                  />
                ),
                
                // Text elements
                p: ({ className, node, ...props }: any) => (
                  <p
                    {...props}
                    className={cn("font-sans leading-relaxed text-[1rem] md:text-[1.05rem] my-4", className)}
                  />
                ),
                strong: ({ className, node, ...props }: any) => (
                  <strong
                    {...props}
                    className={cn("font-sans font-semibold", className)}
                  />
                ),
                em: ({ className, node, ...props }: any) => (
                  <em
                    {...props}
                    className={cn("font-sans italic", className)}
                  />
                ),
                del: ({ className, node, ...props }: any) => (
                  <del
                    {...props}
                    className={cn("font-sans line-through opacity-75", className)}
                  />
                ),
                
                // Links
                a: ({ className, node, ...props }: any) => (
                  <a
                    {...props}
                    className={cn("text-primary hover:text-primary/80 hover:underline transition-colors font-medium", className)}
                    target={props.href?.startsWith('http') ? '_blank' : undefined}
                    rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  />
                ),
                
                // Lists
                ul: ({ className, ordered, node, ...props }: any) => (
                  <ul
                    {...props}
                    className={cn("font-sans space-y-2 my-4 ml-6", className)}
                  />
                ),
                ol: ({ className, ordered, start, node, ...props }: any) => (
                  <ol
                    {...props}
                    start={start}
                    className={cn("font-sans space-y-2 my-4 ml-6", className)}
                  />
                ),
                li: ({ className, children, ordered, index, node, ...props }: any) => {
                  // Handle task list items
                  if (typeof children === 'object' && children?.length > 0 && children[0]?.props?.type === 'checkbox') {
                    const isChecked = children[0].props.checked
                    return (
                      <li
                        {...props}
                        className={cn("font-sans leading-relaxed flex items-center gap-2 list-none ml-0", className)}
                      >
                        {isChecked ? (
                          <CheckSquare className="h-4 w-4 text-primary flex-shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={isChecked ? "line-through opacity-75" : ""}>{children.slice(1)}</span>
                      </li>
                    )
                  }
                  return (
                    <li
                      {...props}
                      className={cn("font-sans leading-relaxed", className)}
                    >
                      {children}
                    </li>
                  )
                },
                
                // Blockquotes
                blockquote: ({ className, node, ...props }: any) => (
                  <blockquote
                    {...props}
                    className={cn(
                      "custom-blockquote font-sans border-l-4 border-primary/30 pl-6 py-2 my-6 italic text-muted-foreground",
                      className
                    )}
                  />
                ),
                
                // Code
                code: ({ className, inline, children, node, ...props }: any) => {
                  if (inline) {
                    return (
                      <code
                        {...props}
                        className={cn("font-mono text-sm bg-muted px-1.5 py-0.5 rounded border", className)}
                      >
                        {children}
                      </code>
                    )
                  }
                  
                  return <code {...props}>{children}</code>
                },
                pre: ({ className, children, ...props }: any) => {
                  const child = children[0] as React.ReactElement;
                  const match = /language-(\w+)/.exec(child.props.className || '')
                  const language = match ? match[1] : ''

                  if (language) {
                    return (
                      <CodeBlock
                        language={language}
                        code={String(child.props.children).replace(/\n$/, '')}
                      />
                    )
                  }

                  return (
                    <pre
                      {...props}
                      className={cn("font-mono text-sm bg-muted border rounded-lg overflow-x-auto my-6 p-4", className)}
                    >
                      {children}
                    </pre>
                  )
                },
                
                // Images
                img: ({ className, node, ...props }: any) => (
                  <Image
                    {...props}
                    alt={props.alt || "Blog image"}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                    className={cn("my-8 rounded-lg shadow-md border", className)}
                  />
                ),
                
                // Tables
                table: ({ className, node, ...props }: any) => (
                  <div className="overflow-x-auto my-6">
                    <table
                      {...props}
                      className={cn("w-full border-collapse border border-border rounded-lg", className)}
                    />
                  </div>
                ),
                thead: ({ className, node, ...props }: any) => (
                  <thead
                    {...props}
                    className={cn("bg-muted/50", className)}
                  />
                ),
                tbody: ({ className, node, ...props }: any) => (
                  <tbody
                    {...props}
                    className={cn("", className)}
                  />
                ),
                tr: ({ className, node, isHeader, ...props }: any) => (
                  <tr
                    {...props}
                    className={cn("border-b border-border hover:bg-muted/30 transition-colors", className)}
                  />
                ),
                th: ({ className, node, isHeader, ...props }: any) => (
                  <th
                    {...props}
                    className={cn("font-sans font-semibold text-left p-3 border-r border-border last:border-r-0", className)}
                  />
                ),
                td: ({ className, node, isHeader, ...props }: any) => (
                  <td
                    {...props}
                    className={cn("font-sans p-3 border-r border-border last:border-r-0", className)}
                  />
                ),
                
                // Horizontal Rule
                hr: ({ className, node, ...props }: any) => (
                  <hr
                    {...props}
                    className={cn("my-8 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent", className)}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
} 
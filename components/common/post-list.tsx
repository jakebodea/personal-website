'use client'

import Link from 'next/link'
import type { Writing } from '@/lib/writings'

interface PostListProps {
  writings: Writing[];
  searchQuery: string;
}

export function PostList({ writings, searchQuery }: PostListProps) {
  return (
    <ul className="space-y-8">
      {writings.length > 0 ? (
        writings.map((writing) => {
          if (writing.type === 'paper') {
            return (
              <li key={writing.title}>
                <a
                  href={writing.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block hover:bg-muted/20 rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <h2 className="text-2xl font-serif text-primary group-hover:text-primary/80 transition-colors">
                      {writing.title}
                    </h2>
                    <p className="text-sm text-muted-foreground font-sans shrink-0 ml-4">
                      {new Date(writing.date + 'T00:00:00').toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground font-sans">
                    {writing.description}
                  </p>
                </a>
              </li>
            )
          }

          return (
            <li key={writing.slug}>
              <Link href={`/writings/${writing.slug}`} className="group block hover:bg-muted/20 rounded-lg p-4 transition-colors">
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="text-2xl font-serif text-primary group-hover:text-primary/80 transition-colors">
                    {writing.title}
                  </h2>
                  <p className="text-sm text-muted-foreground font-sans shrink-0 ml-4">
                    {new Date(writing.date + 'T00:00:00').toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground font-sans">
                  {writing.description}
                </p>
              </Link>
            </li>
          )
        })
      ) : (
        <li className="text-center py-8">
          <p className="text-muted-foreground font-sans">
            No writings found matching &ldquo;{searchQuery}&rdquo;
          </p>
        </li>
      )}
    </ul>
  )
}

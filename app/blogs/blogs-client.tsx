'use client'

import Link from 'next/link'
import { BlogData } from '@/lib/blogs'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

interface BlogsPageProps {
  initialPosts: BlogData[]
}

export default function BlogsPageClient({ initialPosts }: BlogsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(initialPosts)

  useEffect(() => {
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase()
      const filtered = initialPosts.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(searchTerm)
        const contentMatch = post.content.toLowerCase().includes(searchTerm)
        return titleMatch || contentMatch
      })
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(initialPosts)
    }
  }, [searchQuery, initialPosts])

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-10">Blogs</h1>
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search blog post content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <ul className="space-y-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blogs/${post.slug}`} className="group block">
                <h2 className="text-2xl font-serif text-primary group-hover:text-primary/80 group-hover:underline mb-1 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground font-sans">
                  {new Date(post.date + 'T00:00:00').toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </Link>
            </li>
          ))
          ) : (
            <li className="text-center py-8">
              <p className="text-muted-foreground font-sans">
                No blog posts found matching &ldquo;{searchQuery}&rdquo;
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
} 
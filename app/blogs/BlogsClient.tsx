'use client'

import { BlogData } from '@/lib/blogs'
import { useState, useEffect } from 'react'
import PostList from './components/PostList'
import SearchBar from './components/SearchBar'

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
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <PostList posts={filteredPosts} searchQuery={searchQuery} />
      </div>
    </div>
  )
} 
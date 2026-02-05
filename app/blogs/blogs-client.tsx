'use client'

import type { BlogData } from '@/lib/blogs'
import { useState, useEffect } from 'react'
import { PostList } from '@/components/common/post-list'
import { SearchInput } from '@/components/common/search-input'
import { PageWrapper } from '@/components/layout/page-wrapper'

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
    <PageWrapper title="blogs">
      <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="search blog posts..." />
      <PostList posts={filteredPosts} searchQuery={searchQuery} />
    </PageWrapper>
  )
} 
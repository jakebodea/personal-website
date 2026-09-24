'use client'

import type { Writing, WritingType } from '@/lib/writings'
import { useState, useEffect } from 'react'
import { PostList } from '@/components/common/post-list'
import { SearchInput } from '@/components/common/search-input'
import { PageWrapper } from '@/components/layout/page-wrapper'

interface WritingsPageProps {
  initialWritings: Writing[]
}

const FILTER_OPTIONS: { label: string; value: 'all' | WritingType }[] = [
  { label: 'all', value: 'all' },
  { label: 'blogs', value: 'blog' },
  { label: 'papers', value: 'paper' },
]

export default function WritingsPageClient({ initialWritings }: WritingsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | WritingType>('all')
  const [filteredWritings, setFilteredWritings] = useState(initialWritings)

  useEffect(() => {
    let result = initialWritings

    if (typeFilter !== 'all') {
      result = result.filter((w) => w.type === typeFilter)
    }

    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase()
      result = result.filter((w) => {
        const titleMatch = w.title.toLowerCase().includes(term)
        const bodyMatch =
          w.type === 'blog'
            ? w.content.toLowerCase().includes(term)
            : w.description.toLowerCase().includes(term)
        return titleMatch || bodyMatch
      })
    }

    setFilteredWritings(result)
  }, [searchQuery, typeFilter, initialWritings])

  return (
    <PageWrapper title="writing">
      <div className="flex gap-2 mb-4 mt-2">
        {FILTER_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setTypeFilter(value)}
            className={`px-3 py-1 rounded-full text-sm font-sans transition-colors ${
              typeFilter === value
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="search writings..." />
      <PostList writings={filteredWritings} searchQuery={searchQuery} />
    </PageWrapper>
  )
}

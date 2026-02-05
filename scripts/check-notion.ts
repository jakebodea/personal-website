#!/usr/bin/env bun

import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'

import type { NotionBlogPost } from '../lib/notion';
import { getBlogPostsFromNotion, getQuotesFromNotion } from '../lib/notion'

const QUOTES_HASH_FILE = 'quotes-hash.txt'
const BLOGS_HASH_FILE = 'blogs-hash.txt'

function computeHash(payload: string): string {
  return createHash('sha256').update(payload).digest('hex')
}

function readPreviousHash(filePath: string): string | null {
  try {
    return readFileSync(filePath, 'utf8').trim()
  } catch {
    console.log(`No previous hash found for ${filePath} (first run)`)
    return null
  }
}

function writeHash(filePath: string, hash: string): void {
  writeFileSync(filePath, `${hash}\n`, 'utf8')
  console.log(`Saved new hash to ${filePath}`)
}

function normaliseQuotes(quotes: Awaited<ReturnType<typeof getQuotesFromNotion>>): string {
  const sorted = [...quotes].sort((a, b) => {
    const quoteCompare = a.quote.localeCompare(b.quote)
    if (quoteCompare !== 0) {
      return quoteCompare
    }
    return a.author.localeCompare(b.author)
  })

  return JSON.stringify(sorted)
}

function normaliseBlogs(blogs: NotionBlogPost[]): string {
  const sorted = [...blogs]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((blog) => ({
      slug: blog.slug,
      title: blog.title,
      summary: blog.summary,
      publishDate: blog.publishDate,
      status: blog.status,
      tags: blog.tags,
      canonicalUrl: blog.canonicalUrl ?? null,
      lastEditedTime: blog.lastEditedTime ?? null,
      content: blog.content,
    }))

  return JSON.stringify(sorted)
}

async function checkNotionContentChanged(): Promise<void> {
  try {
    console.log('Fetching current quotes from Notion...')
    const quotes = await getQuotesFromNotion()
    console.log(`Found ${quotes.length} quotes`)

    const quotesHash = computeHash(normaliseQuotes(quotes))
    console.log(`Current quotes hash: ${quotesHash}`)

    const previousQuotesHash = readPreviousHash(QUOTES_HASH_FILE)
    const quotesChanged = previousQuotesHash !== quotesHash

    if (quotesChanged) {
      console.log('Quotes have changed')
      writeHash(QUOTES_HASH_FILE, quotesHash)
    } else {
      console.log('No changes detected in quotes')
    }

    console.log('Fetching current blog posts from Notion...')
    const blogs = await getBlogPostsFromNotion()
    console.log(`Found ${blogs.length} published blog posts`)

    const blogsHash = computeHash(normaliseBlogs(blogs))
    console.log(`Current blogs hash: ${blogsHash}`)

    const previousBlogsHash = readPreviousHash(BLOGS_HASH_FILE)
    const blogsChanged = previousBlogsHash !== blogsHash

    if (blogsChanged) {
      console.log('Blogs have changed')
      writeHash(BLOGS_HASH_FILE, blogsHash)
    } else {
      console.log('No changes detected in blogs')
    }

    if (quotesChanged || blogsChanged) {
      console.log('Notion content changed! Build needed.')
      process.exit(0)
    }

    console.log('No changes in Notion content. Skipping build.')
    process.exit(1)
  } catch (error) {
    console.error('Error checking Notion content:', error instanceof Error ? error.message : String(error))
    console.error('Will trigger build to be safe')
    process.exit(2)
  }
}

if (import.meta.main) {
  await checkNotionContentChanged()
}


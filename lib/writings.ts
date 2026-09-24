import matter from 'gray-matter'
import { papers } from '@/content/papers-data'

export type WritingType = 'blog' | 'paper'

export interface BlogWriting {
  type: 'blog'
  slug: string
  title: string
  date: string
  description: string
  content: string
}

export interface PaperWriting {
  type: 'paper'
  title: string
  date: string
  description: string
  pdfUrl: string
}

export type Writing = BlogWriting | PaperWriting

const blogFiles = import.meta.glob<string>('/content/writings/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function getBlogSlugs(): string[] {
  return Object.keys(blogFiles).map((file) => file.split('/').pop()!.replace(/\.md$/, ''))
}

function parseBlogFile(raw: string): Omit<BlogWriting, 'slug' | 'type'> {
  try {
    const { data, content } = matter(raw)

    const title = data.title || 'Untitled Post'
    const date = data.date || new Date().toISOString().split('T')[0]
    const description = data.description || 'No description provided'

    return { title, date, description, content: content.trim() }
  } catch (error) {
    console.error('Error parsing blog file:', error)
    return {
      title: 'Error Loading Post',
      date: new Date().toISOString().split('T')[0],
      description: 'Error loading post',
      content: 'There was an error loading this writing.',
    }
  }
}

export function getBlogWriting(slug: string): BlogWriting | null {
  const raw = blogFiles[`/content/writings/${slug}.md`]
  if (!raw) return null
  const { title, date, description, content } = parseBlogFile(raw)
  return { type: 'blog', slug, title, date, description, content }
}

export function getAllWritings(): Writing[] {
  const blogs: BlogWriting[] = getBlogSlugs().map((slug) => getBlogWriting(slug)!)
  const paperWritings: PaperWriting[] = papers.map((p) => ({ type: 'paper' as const, ...p }))

  return [...blogs, ...paperWritings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export { getBlogSlugs }

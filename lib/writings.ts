import fs from 'fs'
import path from 'path'
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

const WRITINGS_DIR = path.join(process.cwd(), 'content', 'writings')

function getBlogSlugs(): string[] {
  return fs
    .readdirSync(WRITINGS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
}

function parseBlogFile(filePath: string): Omit<BlogWriting, 'slug' | 'type'> {
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)

    const title = data.title || 'Untitled Post'
    const date = data.date || new Date().toISOString().split('T')[0]
    const description = data.description || 'No description provided'

    return { title, date, description, content: content.trim() }
  } catch (error) {
    console.error(`Error parsing blog file ${filePath}:`, error)
    return {
      title: 'Error Loading Post',
      date: new Date().toISOString().split('T')[0],
      description: 'Error loading post',
      content: 'There was an error loading this writing.',
    }
  }
}

export function getBlogWriting(slug: string): BlogWriting {
  const fullPath = path.join(WRITINGS_DIR, `${slug}.md`)
  const { title, date, description, content } = parseBlogFile(fullPath)
  return { type: 'blog', slug, title, date, description, content }
}

export function getAllWritings(): Writing[] {
  const blogs: BlogWriting[] = getBlogSlugs().map((slug) => getBlogWriting(slug))
  const paperWritings: PaperWriting[] = papers.map((p) => ({ type: 'paper' as const, ...p }))

  return [...blogs, ...paperWritings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export { getBlogSlugs }

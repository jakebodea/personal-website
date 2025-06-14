import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogMeta {
  slug: string
  title: string
  date: string
}

export interface BlogData extends BlogMeta {
  content: string
}

const BLOGS_DIR = path.join(process.cwd(), 'content', 'blogs')

function getBlogSlugs(): string[] {
  return fs
    .readdirSync(BLOGS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
}

function parseBlogFile(filePath: string): Omit<BlogData, 'slug'> {
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)

    const title = data.title || 'Untitled Post'
    const date = data.date || new Date().toISOString().split('T')[0]

    return { title, date, content: content.trim() }
  } catch (error) {
    console.error(`Error parsing blog file ${filePath}:`, error)
    return { 
      title: 'Error Loading Post', 
      date: new Date().toISOString().split('T')[0], 
      content: 'There was an error loading this blog post.' 
    }
  }
}

export function getBlogData(slug: string): BlogData {
  const fullPath = path.join(BLOGS_DIR, `${slug}.md`)
  const { title, date, content } = parseBlogFile(fullPath)
  return { slug, title, date, content }
}

export function getAllBlogs(): BlogData[] {
  return getBlogSlugs()
    .map((slug) => getBlogData(slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function searchBlogs(query: string): BlogData[] {
  if (!query.trim()) {
    return getAllBlogs().map(meta => getBlogData(meta.slug))
  }

  const searchTerm = query.toLowerCase()
  
  return getBlogSlugs()
    .map((slug) => getBlogData(slug))
    .filter((blog) => {
      const titleMatch = blog.title.toLowerCase().includes(searchTerm)
      const contentMatch = blog.content.toLowerCase().includes(searchTerm)
      return titleMatch || contentMatch
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export { getBlogSlugs } 
import fs from 'fs'
import path from 'path'

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
    const lines = raw.split(/\r?\n/)

    const titleLine = lines[0] || ''
    const dateLine = lines[1] || ''
    const title = titleLine.replace(/^#\s*/, '').trim()
    const date = dateLine.trim()
    const content = lines.slice(2).join('\n').trim()

    return { title, date, content }
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
import { getAllBlogs } from '@/lib/blogs'
import BlogsPageClient from './BlogsClient'

export default async function BlogsPage() {
  const posts = getAllBlogs()
  
  return <BlogsPageClient initialPosts={posts} />
} 
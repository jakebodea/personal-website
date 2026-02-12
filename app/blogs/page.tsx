import { getAllBlogs } from '@/lib/blogs'
import BlogsPageClient from './blogs-client'

export default async function BlogsPage() {
  const posts = getAllBlogs()
  
  return <BlogsPageClient initialPosts={posts} />
} 
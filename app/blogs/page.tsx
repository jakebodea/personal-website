import Link from 'next/link'
import { getAllBlogs } from '@/lib/blogs'

export const metadata = {
  title: 'Blog',
  description: "Blog posts by Jake Bodea"
}

export default function BlogsPage() {
  const posts = getAllBlogs()

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-10">Blog</h1>
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blogs/${post.slug}`} className="group block">
                <h2 className="text-2xl font-serif text-foreground group-hover:underline mb-1">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground font-sans">
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })} | By Jake Bodea
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 
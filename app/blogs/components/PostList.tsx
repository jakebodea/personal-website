'use client'

import Link from 'next/link'
import { BlogData } from '@/lib/blogs'

interface PostListProps {
    posts: BlogData[];
    searchQuery: string;
}

export default function PostList({ posts, searchQuery }: PostListProps) {
    return (
        <ul className="space-y-8">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <li key={post.slug}>
                        <Link href={`/blogs/${post.slug}`} className="group block hover:bg-muted/20 rounded-lg p-4 transition-colors">
                            <div className="flex items-baseline justify-between mb-2">
                                <h2 className="text-2xl font-serif text-primary group-hover:text-primary/80 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-muted-foreground font-sans">
                                    {new Date(post.date + 'T00:00:00').toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long', 
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground font-sans">
                                {post.description}
                            </p>
                        </Link>
                    </li>
                ))
            ) : (
                <li className="text-center py-8">
                    <p className="text-muted-foreground font-sans">
                        No blog posts found matching &ldquo;{searchQuery}&rdquo;
                    </p>
                </li>
            )}
        </ul>
    )
} 
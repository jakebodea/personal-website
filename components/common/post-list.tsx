"use client";

import Link from "@/components/common/site-link";
import type { Writing } from "@/lib/writings";

interface PostListProps {
  writings: Writing[];
  searchQuery: string;
}

export const PostList = ({ writings, searchQuery }: PostListProps) => (
  <ul className="space-y-8">
    {writings.length > 0 ? (
      writings.map((writing) => {
        if (writing.type === "paper") {
          return (
            <li key={writing.title}>
              <a
                href={writing.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg p-4 transition-colors hover:bg-muted/20"
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="font-serif text-2xl text-primary transition-colors group-hover:text-primary/80">
                    {writing.title}
                  </h2>
                  <p className="ml-4 shrink-0 font-sans text-sm text-muted-foreground">
                    {new Date(`${writing.date}T00:00:00`).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <p className="font-sans text-sm text-muted-foreground">
                  {writing.description}
                </p>
              </a>
            </li>
          );
        }

        return (
          <li key={writing.slug}>
            <Link
              href={`/writings/${writing.slug}`}
              className="group block rounded-lg p-4 transition-colors hover:bg-muted/20"
            >
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="font-serif text-2xl text-primary transition-colors group-hover:text-primary/80">
                  {writing.title}
                </h2>
                <p className="ml-4 shrink-0 font-sans text-sm text-muted-foreground">
                  {new Date(`${writing.date}T00:00:00`).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <p className="font-sans text-sm text-muted-foreground">
                {writing.description}
              </p>
            </Link>
          </li>
        );
      })
    ) : (
      <li className="py-8 text-center">
        <p className="font-sans text-muted-foreground">
          No writings found matching &ldquo;{searchQuery}&rdquo;
        </p>
      </li>
    )}
  </ul>
);

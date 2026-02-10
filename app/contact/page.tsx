"use client"

import Link from "next/link"
import { PageTitle } from "@/components/layout/page-title"

const contactLinks = [
  {
    title: "Email",
    url: "mailto:jakebodea@gmail.com",
    display: "jakebodea@gmail.com"
  },
  {
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/jakebodea/",
    display: "linkedin.com/in/jakebodea"
  },
  {
    title: "GitHub",
    url: "https://github.com/jakebodea",
    display: "github.com/jakebodea"
  },
  {
    title: "𝕏",
    url: "https://x.com/jakebodea",
    display: "x.com/jakebodea"
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center">
      <div className="container max-w-2xl mx-auto px-6 py-12">
        <PageTitle>contact</PageTitle>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
          i'm always interested in connecting. here's where you can find me:
        </p>

        <div className="space-y-3">
          {contactLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent/5 transition-colors"
            >
              <span className="text-muted-foreground group-hover:text-accent transition-colors">→</span>
              <code className="font-mono text-sm text-muted-foreground group-hover:text-accent transition-colors">
                {link.display}
              </code>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

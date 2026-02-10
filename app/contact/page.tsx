"use client"

import { useState } from "react"
import Link from "next/link"
import { PageTitle } from "@/components/layout/page-title"
import { motion, AnimatePresence } from "framer-motion"

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
  const [linkedInHovered, setLinkedInHovered] = useState(false)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center">
      <div className="container max-w-2xl mx-auto px-6 py-12">
        <PageTitle>contact</PageTitle>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
          i'm always interested in connecting. here's where you can find me:
        </p>

        <div className="rounded-lg border border-accent/10 bg-muted/20 p-4 font-mono text-sm">
          <div className="space-y-2">
            {contactLinks.map((link) => (
              <div
                key={link.url}
                onMouseEnter={() => link.display.includes("linkedin") && setLinkedInHovered(true)}
                onMouseLeave={() => setLinkedInHovered(false)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent/60">$</span>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-muted-foreground hover:text-accent transition-colors"
                  >
                    <span className="text-accent/70 group-hover:text-accent">open</span>
                    <span className="ml-2 group-hover:underline">{link.display}</span>
                  </Link>
                </div>
                <AnimatePresence>
                  {linkedInHovered && link.display.includes("linkedin") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 py-1 text-muted-foreground/70 text-xs italic">
                        # unfortunately i still need this platform
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

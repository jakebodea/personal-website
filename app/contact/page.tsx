"use client"

import { PageTitle } from "@/components/layout/page-title"
import { ContactLink } from "./contact-link"

const contactLinks = [
  {
    url: "mailto:jakebodea@gmail.com",
    display: "jakebodea@gmail.com",
    easterEgg: "no spam pls"
  },
  {
    url: "https://x.com/jakebodea",
    display: "x.com/jakebodea"
  },
  {
    url: "https://www.linkedin.com/in/jakebodea/",
    display: "linkedin.com/in/jakebodea",
    easterEgg: "unfortunately i still need this platform"
  },
  {
    url: "https://github.com/jakebodea",
    display: "github.com/jakebodea",
    easterEgg: "don't DM me here but check out my commit history map"
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

        <div className="rounded-lg border border-accent/10 bg-muted/20 p-4 font-mono text-sm">
          <div className="space-y-2">
            {contactLinks.map((link) => (
              <ContactLink
                key={link.url}
                url={link.url}
                display={link.display}
                easterEgg={link.easterEgg}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

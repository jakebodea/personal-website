"use client";

import { PageTitle } from "@/components/layout/page-title";

import { ContactLink } from "./contact-link";

const contactLinks = [
  {
    url: "mailto:jakebodea@gmail.com",
    display: "jakebodea@gmail.com",
    easterEgg: "pls no spam thanks",
  },
  {
    url: "https://x.com/jakebodea",
    display: "x.com/jakebodea",
  },
  {
    url: "https://www.linkedin.com/in/jakebodea/",
    display: "linkedin.com/in/jakebodea",
    easterEgg: "unfortunately",
  },
  {
    url: "https://github.com/jakebodea",
    display: "github.com/jakebodea",
    easterEgg: "check out my commit history map",
  },
];

const ContactPage = () => (
  <div className="flex min-h-[calc(100vh-3.5rem)] items-center">
    <div className="container mx-auto max-w-2xl px-6 py-12">
      <PageTitle>contact</PageTitle>

      <p className="mb-12 text-lg leading-relaxed text-muted-foreground md:text-xl">
        I&apos;m always interested in connecting. Here&apos;s where you can find
        me:
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
);

export default ContactPage;

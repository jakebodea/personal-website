"use client"

import Link from "next/link"
import { PageTitle } from "@/components/layout/page-title"

function TypographyParagraph({ children }: { children: React.ReactNode }) {
  return (
    <> 
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
        {children}
      </p>
      <br />
    </>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center">
      <div className="container max-w-2xl mx-auto px-6 py-12">
        <PageTitle>jake bodea</PageTitle>

        <TypographyParagraph>
          resumes are boring, so i made this website to showcase myself. i have a{" "}
          <Link
            href="/timeline"
            className="text-accent hover:underline underline-offset-4"
          >
            timeline
          </Link>{" "}
          for more details, but i prefer to{" "}
          <Link
            href="/projects"
            className="text-accent hover:underline underline-offset-4"
          >
            show
          </Link>{" "}
          my accomplishments
        </TypographyParagraph>

        <TypographyParagraph>
          i&apos;m an all-around engineer with a math background. i majored in
          math with minors in cs, business data analytics, and music. currently
          studying ai at stanford. i love working on product and i like making
          music
        </TypographyParagraph>
        <TypographyParagraph> 
          my tech stack is pretty much &quot;i&apos;ll learn whatever you need me to learn&quot;, 
          but i have strong experience with TypeScript, Python, and SQL. also
          dabbling in Rust :) 
        </TypographyParagraph>
        <TypographyParagraph>
          in my free time, you&apos;ll find me volunteering at church, working on 
          side projects (technical or musical), or exploring new adventures 
          with my wife
        </TypographyParagraph>

        <p className="text-base text-muted-foreground/70 mt-8">
          thanks for checking out my website, and please please please {" "}
          <Link
            href="/contact"
            className="text-accent hover:underline underline-offset-4"
          >
            say hi
          </Link>
          {" "}!
        </p>
      </div>
    </div>
  )
}

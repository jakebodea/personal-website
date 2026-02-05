import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center">
      <div className="container max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-foreground">
          jake bodea
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          i dislike resumes, so i made this website to showcase myself. i have a{" "}
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
          my accomplishments.
        </p>

        <p className="text-base text-muted-foreground/70 mt-8">
          i also dislike typing with capital letters unless i have to.
        </p>
      </div>
    </div>
  )
}

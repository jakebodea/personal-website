import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: 'Projects',
  description: 'Jake Bodea\'s projects'
}

export default function ProjectsPage(): React.ReactNode {
  return (
    <div className="min-h-full bg-gradient-to-br from-background via-contrast-lightest to-contrast-lighter">
      <div className="container max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">
            Featured Projects
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
            A showcase of my technical work, from AI applications to full-stack solutions.
          </p>
        </div>

        {/* Coming Soon Content */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🚧</span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Coming Soon</h3>
              <p className="text-muted-foreground leading-relaxed">
                I'm currently curating my best projects for this showcase. 
                In the meantime, feel free to explore my GitHub for active repositories and contributions.
              </p>
              <a 
                href="https://github.com/jakebodea" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                View GitHub
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

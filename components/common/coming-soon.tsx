import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const ComingSoon = () => (
  <Card>
    <CardContent>
      <div className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🚧</span>
          </div>
          <h3 className="text-2xl font-semibold text-foreground">coming soon</h3>
          <p className="text-muted-foreground leading-relaxed">
            i&apos;m working on putting together some projects i can share publicly (most of my work is internal-only, so bear with me!).
            in the meantime, check out my experience timeline for project overviews, or explore my github for contribution history.
          </p>
          <a
            href="https://github.com/jakebodea"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            view github
          </a>
        </div>
      </div>
    </CardContent>
  </Card>
);

export { ComingSoon };

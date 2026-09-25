import React from "react";

import { Card, CardContent } from "@/components/ui/card";

const ComingSoon = () => (
  <Card>
    <CardContent>
      <div className="p-12 text-center">
        <div className="mx-auto max-w-md space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <span className="text-2xl">🚧</span>
          </div>
          <h3 className="text-2xl font-semibold text-foreground">
            coming soon
          </h3>
          <p className="leading-relaxed text-muted-foreground">
            i&apos;m working on putting together some projects i can share
            publicly (most of my work is internal-only, so bear with me!). in
            the meantime, check out my experience timeline for project
            overviews, or explore my github for contribution history.
          </p>
          <a
            href="https://github.com/jakebodea"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            view github
          </a>
        </div>
      </div>
    </CardContent>
  </Card>
);

export { ComingSoon };

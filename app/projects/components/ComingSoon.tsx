import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const ComingSoon = () => (
    <Card className="border-0 shadow-sm bg-contrast-light/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Coming Soon</h3>
                <p className="text-muted-foreground leading-relaxed">
                    I&apos;m working on putting together some projects I can share publicly (most of my work is internal-only, so bear with me!).
                    In the meantime, check out my experience timeline for project overviews, or explore my GitHub for contribution history.
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
);

export default ComingSoon; 
// "use client";

import React from "react";
// import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: 'Home',
  description: 'Jake Bodea\'s home page'
}

export default function Home(): React.ReactNode {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              Available for new opportunities
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-light leading-tight text-foreground mb-6">
               I&apos;m Jake, a mathematician and musician turned{" "}
               <span className="text-primary font-medium italic relative">
                 ML Engineer
               </span>
               {" "}& <span className="text-primary font-medium italic relative">
                 Full-Stack Developer
               </span>.
             </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
              Building intelligent applications that bridge the gap between complex data and meaningful user experiences.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 md:gap-12">
          {/* About Section */}
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary rounded-full mr-3"></span>
                About Me
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I specialize in building intelligent applications, leveraging a strong foundation in{" "}
                  <span className="text-foreground font-medium bg-accent/20 px-2 py-0.5 rounded">Python</span>,{" "}
                  <span className="text-foreground font-medium bg-accent/20 px-2 py-0.5 rounded">SQL</span>, and{" "}
                  <span className="text-foreground font-medium bg-accent/20 px-2 py-0.5 rounded">JavaScript/TypeScript</span>.
                  My experience spans the full stack, from crafting user-friendly web interfaces to developing robust backend systems and native iOS applications.
                </p>
                <p>
                  I thrive on bringing ideas to life through code, with a particular passion for the rapidly evolving field of{" "}
                  <span className="text-primary font-medium">Artificial Intelligence</span>. My unique background in mathematics and music gives me a distinctive perspective on pattern recognition and algorithmic thinking.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Interests Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <span className="w-1 h-4 bg-accent rounded-full mr-2"></span>
                  Current Focus
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    AI/ML application development
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    Music & AI intersection projects
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                    Rapid prototyping & experimentation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <span className="w-1 h-4 bg-accent rounded-full mr-2"></span>
                  Beyond Code
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                    Serving at Agape Christian Church
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                    Soccer enthusiast (Força Barça!)
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                    Music composition & performance
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Let&apos;s Build Something Amazing
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                I&apos;m always open to collaborating on creative and challenging projects. 
                Whether you&apos;re looking to build an AI-powered application or explore innovative solutions, let&apos;s connect.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.linkedin.com/in/jakebodea/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Connect on LinkedIn
                </a>
                <a 
                  href="https://github.com/jakebodea" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent/50 transition-colors"
                >
                  View GitHub
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

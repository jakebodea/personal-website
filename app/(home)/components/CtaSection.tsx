"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function CtaSection(): React.ReactNode {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
        >
            <Card className="border-0 shadow-sm bg-contrast-light/50 backdrop-blur-sm">
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
        </motion.div>
    )
} 
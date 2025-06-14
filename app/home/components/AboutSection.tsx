"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutSection(): React.ReactNode {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <Card className="border-0 shadow-sm bg-contrast-lightest/80 backdrop-blur-sm">
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
        </motion.div>
    )
} 
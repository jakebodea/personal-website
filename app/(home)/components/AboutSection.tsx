"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import EmphasisText from "@/components/text/EmphasisText";

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
                            I build AI systems that solve real problems –– be it saving people hours of work, 
                            catching issues before they become expensive mistakes, or bringing in new revenue. 
                            While my primary focus is on <EmphasisText>AI/ML engineering</EmphasisText> (whichever is 
                            necessary for the project at hand), I also emphasize <EmphasisText>full-stack development</EmphasisText> 
                            because I believe that the best AI is the kind that actually gets used –– whether or not people know it's AI.
                        </p>
                        <p>
                            Some keyword spam (sorry):
                            <ul className="list-disc pl-5">
                                <li>
                                    My tech stack is always evolving, but my current language stack is <EmphasisText>Python, SQL, JavaScript, and TypeScript.</EmphasisText>
                                </li>
                                <li>
                                    I&apos;ve been working on mastering some more low-level languages like <EmphasisText>C++ and Rust.</EmphasisText>
                                </li>
                                <li>
                                    My current go-to systems and frameworks for frontend are <EmphasisText>React, Next.js</EmphasisText>, Tailwind CSS, and Shadcn UI.
                                </li>
                                <li>
                                    For my backend, I use FastAPI.
                                </li>
                                <li>
                                    I&apos;ve worked with databases like PostgreSQL, Databricks, and MS SQL.
                                </li>
                                <li>
                                    I use Docker for containerization.
                                </li>
                                <li>
                                    I have experience with cloud platforms such as AWS, GCP, and Azure.
                                </li>
                                <li>
                                    I&apos;ve worked with both GitHub and Bitbucket for version control and building CI/CD pipelines.
                                </li>
                                <li>
                                    As far as AI/ML APIs, I&apos;ve worked with OpenAI, Anthropic, Google, and Hugging Face.
                                </li>
                                <li>
                                    Model development is obviously in <EmphasisText>PyTorch</EmphasisText> :)
                                </li>
                            </ul>
                        </p>
                        <p>
                            More on traditional <EmphasisText>Machine Learning:</EmphasisText> My foundations are rooted in my academic background.
                            I&apos;ve been working towards an AI graduate certificate at <EmphasisText>Stanford,</EmphasisText> maintaining a {" "}
                            <EmphasisText>4.0 GPA</EmphasisText> through some of the most challenging courses in the field. I&apos;ve also 
                            completed an undergraduate degree in math, CS, and business data analytics (and music lol), where I graduated as the 
                            <EmphasisText>outstanding Mathematics graduate.</EmphasisText> This background enables me to approach ML challenges with 
                            deep fundamentals understanding, leading to strong models that actually make an impact on the business.
                        </p>
                        <p>
                            Outside my day job, my non-extracurricular time is spent either <EmphasisText>consulting</EmphasisText> local businesses for AI solutions, 
                            or as a <EmphasisText>course facilitator</EmphasisText> for Stanford&apos;s Machine Learning and AI Principles courses. 
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
} 
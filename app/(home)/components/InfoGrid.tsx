"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function InfoGrid(): React.ReactNode {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Card className="border-0 shadow-sm bg-contrast-lighter/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <span className="w-1 h-4 bg-accent rounded-full mr-2"></span>
                            What I&apos;m Building
                        </h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center">
                                <span className="flex-none w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                                Autonomous agents that actually save businesses time and money
                            </li>
                            <li className="flex items-center">
                                <span className="flex-none w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                                Embedded machine learning models for quick, impactful wins
                            </li>
                            <li className="flex items-center">
                                <span className="flex-none w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                                Teaching Stanford professional students how to train and devleop ML models
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
            >
                 <Card className="border-0 shadow-sm bg-contrast-lighter/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <span className="w-1 h-4 bg-accent rounded-full mr-2"></span>                            Beyond Code
                        </h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center">
                                <span className="flex-none w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                                Serving at Agape Christian Church
                            </li>
                            <li className="flex items-center">
                                <span className="flex-none w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                                Soccer enthusiast (Força Barça!)
                            </li>
                            <li className="flex items-center">
                                <span className="flex-none w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                                Music composition & performance
                            </li>
                            <li className="flex items-center">
                                <span className="flex-none w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                                Nature and beach lover
                            </li>
                            <li className="flex items-center">
                                <span className="flex-none w-1.5 h-1.5 bg-accent rounded-full mr-3"></span>
                                Music composition & performance
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
} 
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import "./contact-link.css"

function generateRandomKeyframes(): string {
  let keyframes = "0% { width: 0; }"
  const numSteps = Math.floor(Math.random() * 15) + 15 // 15-29 steps
  const increments: number[] = []
  let total = 0

  // Generate random increments (1-5%) for each step
  for (let i = 0; i < numSteps; i++) {
    const increment = Math.random() * 4 + 1 // 1-5%
    increments.push(increment)
    total += increment
  }

  // Normalize increments to sum to 100%
  const normalized = increments.map(inc => (inc / total) * 100)

  // Generate keyframes with cumulative widths
  let currentWidth = 0
  normalized.forEach((increment, index) => {
    currentWidth += increment
    const keyframePercent = ((index + 1) / numSteps) * 100
    keyframes += ` ${keyframePercent.toFixed(1)}% { width: ${currentWidth.toFixed(1)}%; }`
  })

  return keyframes
}

interface ContactLinkProps {
  url: string
  display: string
  easterEgg?: string
}

export function ContactLink({ url, display, easterEgg }: ContactLinkProps) {
  const [isHovered, setIsHovered] = useState(false)
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const animationIdRef = useRef<string>("")

  useEffect(() => {
    if (isHovered && easterEgg) {
      const animationId = `typing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      animationIdRef.current = animationId

      const keyframes = generateRandomKeyframes()
      const css = `@keyframes ${animationId} { ${keyframes} }`

      // Remove old style element if it exists
      if (styleRef.current) {
        styleRef.current.remove()
      }

      // Create new style element each time
      styleRef.current = document.createElement("style")
      styleRef.current.textContent = css
      document.head.appendChild(styleRef.current)
    }

    return () => {
      // Cleanup on unmount
      if (styleRef.current) {
        styleRef.current.remove()
        styleRef.current = null
      }
    }
  }, [isHovered, easterEgg])

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <span className="text-accent/60">$</span>
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group text-muted-foreground hover:text-accent transition-colors"
        >
          <span className="text-accent/70 group-hover:text-accent">open</span>
          <span className="ml-2 group-hover:underline">{display}</span>
        </Link>
      </div>
      <AnimatePresence>
        {isHovered && easterEgg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-1 text-muted-foreground/70 text-xs font-mono"
            >
              <span>#</span>
              <span className="flex items-center">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{
                    duration: 0.6,
                    ease: "linear",
                  }}
                  className="inline-block overflow-hidden whitespace-nowrap"
                  style={{
                    animation: isHovered && easterEgg ? `${animationIdRef.current} 0.6s linear forwards` : "none",
                  }}
                >
                  {easterEgg}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.1,
                    delay: 0.1,
                  }}
                  className="cursor-block"
                />
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

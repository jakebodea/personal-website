"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import "./contact-link.css"

function generateRandomKeyframes(textLength: number): string {
  let keyframes = "0% { width: 0; }"
  let currentWidth = 0
  const steps = Math.ceil(textLength * 1.5)

  for (let i = 1; i < steps; i++) {
    const randomPercent = Math.random() * 4 + 1
    currentWidth += randomPercent
    if (currentWidth >= 100) {
      keyframes += ` 100% { width: 100%; }`
      break
    }
    const keyframePercent = (i / steps) * 100
    keyframes += ` ${keyframePercent.toFixed(1)}% { width: ${currentWidth.toFixed(1)}%; }`
  }

  if (!keyframes.includes("100%")) {
    keyframes += " 100% { width: 100%; }"
  }

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

      const keyframes = generateRandomKeyframes(easterEgg.length)
      const css = `@keyframes ${animationId} { ${keyframes} }`

      // Remove old style element if it exists
      if (styleRef.current) {
        styleRef.current.remove()
      }

      // Create new style element each time
      styleRef.current = document.createElement("style")
      styleRef.current.textContent = css
      document.head.appendChild(styleRef.current)

      console.log("Generated animation:", animationId, keyframes.substring(0, 100))
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

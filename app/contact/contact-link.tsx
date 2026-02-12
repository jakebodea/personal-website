"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import "./contact-link.css"

function generateRandomKeyframes(): string {
  const numSteps = Math.floor(Math.random() * 15) + 15
  const increments = Array.from({ length: numSteps }, () => Math.random() * 4 + 1)
  const total = increments.reduce((a, b) => a + b, 0)
  const normalized = increments.map(inc => (inc / total) * 100)

  let keyframes = "0% { width: 0; }"
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

  const isEmail = url.startsWith("mailto:")
  const emailAddress = isEmail ? url.replace("mailto:", "") : ""

  useEffect(() => {
    if (isHovered && easterEgg) {
      const animationId = `typing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      animationIdRef.current = animationId

      const keyframes = generateRandomKeyframes()
      const css = `@keyframes ${animationId} { ${keyframes} }`

      if (styleRef.current) {
        styleRef.current.remove()
      }

      styleRef.current = document.createElement("style")
      styleRef.current.textContent = css
      document.head.appendChild(styleRef.current)
    }

    return () => {
      if (styleRef.current) {
        styleRef.current.remove()
        styleRef.current = null
      }
    }
  }, [isHovered, easterEgg])

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      toast.success("Email copied to clipboard!", {
        duration: 2000,
      })
    } catch {
      toast.error("Failed to copy email")
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="min-h-[3rem]"
    >
      <div className="flex items-center gap-2">
        <span className="text-accent/60">$</span>
        {isEmail ? (
          <button
            onClick={handleEmailClick}
            className="group text-muted-foreground hover:text-accent transition-colors text-left"
          >
            <span className="text-accent/70 group-hover:text-accent">copy</span>
            <span className="ml-2 group-hover:underline">{display}</span>
          </button>
        ) : (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-muted-foreground hover:text-accent transition-colors"
          >
            <span className="text-accent/70 group-hover:text-accent">open</span>
            <span className="ml-2 group-hover:underline">{display}</span>
          </Link>
        )}
      </div>
      <div className="h-6 overflow-hidden">
        {easterEgg && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {isEmail ? (
                  <button
                    onClick={handleEmailClick}
                    className="flex items-center gap-2 py-1 text-muted-foreground/70 text-xs font-mono text-left"
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
                  </button>
                ) : (
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
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

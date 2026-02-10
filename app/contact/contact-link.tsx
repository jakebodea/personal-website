"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import "./contact-link.css"

interface ContactLinkProps {
  url: string
  display: string
  easterEgg?: string
}

export function ContactLink({ url, display, easterEgg }: ContactLinkProps) {
  const [isHovered, setIsHovered] = useState(false)

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
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="inline-block overflow-hidden whitespace-nowrap typing-container"
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

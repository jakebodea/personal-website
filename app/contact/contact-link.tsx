"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

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
            <div className="flex items-center gap-2 py-1 text-muted-foreground/70 text-xs italic">
              <span>#</span>
              <span>{easterEgg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

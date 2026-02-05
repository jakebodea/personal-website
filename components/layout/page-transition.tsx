"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useNavigation } from "@/components/providers/navigation-provider"
import { useIsMobile } from "@/hooks/use-mobile"

import type { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const { direction } = useNavigation()
  const isMobile = useIsMobile()

  return (
    <motion.div
      key={pathname}
      className="origin-top"
      initial={{
        opacity: 0,
        x: isMobile ? 0 : direction === "right" ? 100 : direction === "left" ? -100 : 0,
        scale: isMobile ? 1 : 0.97,
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  )
}

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useNavigation } from "@/components/providers/navigation-provider"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const { direction } = useNavigation()

  return (
    <motion.div
      key={pathname}
      initial={{
        opacity: 0,
        x: direction === "right" ? 100 : direction === "left" ? -100 : 0,
        scale: 0.97,
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

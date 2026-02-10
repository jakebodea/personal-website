"use client"

import { createContext, useContext, useRef, useMemo } from "react"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

type Direction = "left" | "right" | "none"

interface NavigationContextType {
  direction: Direction
  setDirection: (direction: Direction) => void
}

const NavigationContext = createContext<NavigationContextType>({
  direction: "none",
  setDirection: () => {},
})

export function useNavigation() {
  return useContext(NavigationContext)
}

// Order of nav items for determining direction
const navOrder = ["/", "/timeline", "/projects", "/blogs", "/quotes"]

function getNavIndex(pathname: string): number {
  if (pathname === "/") return 0
  const baseRoute = "/" + pathname.split("/")[1]
  return navOrder.indexOf(baseRoute)
}

function getPathDepth(pathname: string): number {
  return pathname.split("/").filter(Boolean).length
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const prevPathRef = useRef(pathname)
  const directionRef = useRef<Direction>("none")

  // Calculate direction synchronously during render
  if (prevPathRef.current !== pathname) {
    const prevIndex = getNavIndex(prevPathRef.current)
    const currentIndex = getNavIndex(pathname)

    if (prevIndex !== -1 && currentIndex !== -1) {
      if (prevIndex !== currentIndex) {
        // Different main sections
        directionRef.current = currentIndex > prevIndex ? "right" : "left"
      } else if (prevIndex === currentIndex) {
        // Same main section - check path depth for sub-routes
        const prevDepth = getPathDepth(prevPathRef.current)
        const currentDepth = getPathDepth(pathname)
        if (currentDepth > prevDepth) {
          directionRef.current = "right"
        } else if (currentDepth < prevDepth) {
          directionRef.current = "left"
        }
      }
    }
    prevPathRef.current = pathname
  }

  const contextValue = useMemo(
    () => ({
      direction: directionRef.current,
      setDirection: (dir: Direction) => {
        directionRef.current = dir
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  )

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

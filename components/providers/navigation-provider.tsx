"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

type Direction = "left" | "right" | "none"

interface NavigationContextType {
  direction: Direction
  setDirection: (direction: Direction) => void
}

const NavigationContext = React.createContext<NavigationContextType>({
  direction: "none",
  setDirection: () => {},
})

export function useNavigation() {
  return React.useContext(NavigationContext)
}

// Order of nav items for determining direction
const navOrder = ["/", "/timeline", "/projects", "/blogs", "/quotes"]

function getNavIndex(pathname: string): number {
  if (pathname === "/") return 0
  const baseRoute = "/" + pathname.split("/")[1]
  return navOrder.indexOf(baseRoute)
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPathRef = React.useRef(pathname)
  const directionRef = React.useRef<Direction>("none")

  // Calculate direction synchronously during render
  if (prevPathRef.current !== pathname) {
    const prevIndex = getNavIndex(prevPathRef.current)
    const currentIndex = getNavIndex(pathname)

    if (prevIndex !== -1 && currentIndex !== -1 && prevIndex !== currentIndex) {
      directionRef.current = currentIndex > prevIndex ? "right" : "left"
    }
    prevPathRef.current = pathname
  }

  const contextValue = React.useMemo(
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

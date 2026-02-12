"use client"

import { createContext, useContext, useState, useMemo } from "react"
import type { ReactNode } from "react"

interface StickyTitleContextType {
  hasStickyTitle: boolean
  setHasStickyTitle: (value: boolean) => void
}

const StickyTitleContext = createContext<StickyTitleContextType>({
  hasStickyTitle: false,
  setHasStickyTitle: () => {},
})

export function useStickyTitle() {
  return useContext(StickyTitleContext)
}

export function StickyTitleProvider({ children }: { children: ReactNode }) {
  const [hasStickyTitle, setHasStickyTitle] = useState(false)

  const value = useMemo(
    () => ({ hasStickyTitle, setHasStickyTitle }),
    [hasStickyTitle]
  )

  return (
    <StickyTitleContext.Provider value={value}>
      {children}
    </StickyTitleContext.Provider>
  )
}

"use client";

import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";

interface StickyTitleContextType {
  hasStickyTitle: boolean;
  setHasStickyTitle: (value: boolean) => void;
}

const noopSetHasStickyTitle = (_value: boolean): void => undefined;

const StickyTitleContext = createContext<StickyTitleContextType>({
  hasStickyTitle: false,
  setHasStickyTitle: noopSetHasStickyTitle,
});

const useStickyTitle = () => useContext(StickyTitleContext);

const StickyTitleProvider = ({ children }: { children: ReactNode }) => {
  const [hasStickyTitle, setHasStickyTitle] = useState(false);

  const value = useMemo(
    () => ({ hasStickyTitle, setHasStickyTitle }),
    [hasStickyTitle]
  );

  return (
    <StickyTitleContext.Provider value={value}>
      {children}
    </StickyTitleContext.Provider>
  );
};

export { StickyTitleProvider, useStickyTitle };

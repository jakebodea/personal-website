"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { navOrder } from "@/lib/nav-config";
import { usePathname } from "@/lib/site-navigation";

type Direction = "left" | "right" | "none";

interface NavigationContextType {
  direction: Direction;
  setDirection: (direction: Direction) => void;
}

const noopSetDirection = (_direction: Direction): void => undefined;

const NavigationContext = createContext<NavigationContextType>({
  direction: "none",
  setDirection: noopSetDirection,
});

const useNavigation = () => useContext(NavigationContext);

const getNavIndex = (pathname: string): number => {
  if (pathname === "/") {
    return 0;
  }
  const baseRoute = `/${pathname.split("/")[1]}`;
  return navOrder.indexOf(baseRoute);
};

const getPathDepth = (pathname: string): number =>
  pathname.split("/").filter(Boolean).length;

const computeDirection = (
  previousPathname: string,
  currentPathname: string
): Direction => {
  const prevIndex = getNavIndex(previousPathname);
  const currentIndex = getNavIndex(currentPathname);

  if (prevIndex === -1 || currentIndex === -1) {
    return "none";
  }

  if (prevIndex !== currentIndex) {
    return currentIndex > prevIndex ? "right" : "left";
  }

  const prevDepth = getPathDepth(previousPathname);
  const currentDepth = getPathDepth(currentPathname);
  if (currentDepth > prevDepth) {
    return "right";
  }
  if (currentDepth < prevDepth) {
    return "left";
  }

  return "none";
};

const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [navState, setNavState] = useState<{
    pathname: string;
    direction: Direction;
  }>(() => ({
    pathname,
    direction: "none",
  }));

  if (navState.pathname !== pathname) {
    setNavState({
      pathname,
      direction: computeDirection(navState.pathname, pathname),
    });
  }

  const contextValue = useMemo(
    () => ({
      direction: navState.direction,
      setDirection: (dir: Direction) => {
        setNavState((prev) => ({ ...prev, direction: dir }));
      },
    }),
    [navState.direction]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationProvider, useNavigation };

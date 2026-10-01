"use client";

import { domAnimation, LazyMotion, m } from "framer-motion";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { useNavigation } from "@/components/providers/navigation-provider";
import { useRenderedPathname } from "@/lib/site-navigation";

interface PageTransitionProps {
  children: ReactNode;
}

const DESKTOP_NAV_MEDIA_QUERY = "(max-width: 1023px)";

const subscribeToNavLayout = (onStoreChange: () => void) => {
  const mediaQueryList = window.matchMedia(DESKTOP_NAV_MEDIA_QUERY);
  mediaQueryList.addEventListener("change", onStoreChange);
  return () => {
    mediaQueryList.removeEventListener("change", onStoreChange);
  };
};

const getIsMobileNavSnapshot = () =>
  window.matchMedia(DESKTOP_NAV_MEDIA_QUERY).matches;

const getIsMobileNavServerSnapshot = () => false;

const unsubscribeFromNothing = (): void => undefined;

const subscribeToNothing = () => unsubscribeFromNothing;

// False while hydrating server HTML, true for every client render after that.
const useIsHydrated = () =>
  useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );

const useIsMobileNav = () =>
  useSyncExternalStore(
    subscribeToNavLayout,
    getIsMobileNavSnapshot,
    getIsMobileNavServerSnapshot
  );

const getInitialX = (
  isMobile: boolean,
  direction: "left" | "right" | "none"
): number => {
  if (isMobile) {
    return 0;
  }
  if (direction === "right") {
    return 100;
  }
  if (direction === "left") {
    return -100;
  }
  return 0;
};

export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = useRenderedPathname();
  const { direction } = useNavigation();
  const isMobile = useIsMobileNav();
  const initialX = getInitialX(isMobile, direction);
  // Server-rendered HTML should be visible immediately; only animate client navigations.
  const isHydrated = useIsHydrated();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        key={pathname}
        className="origin-top"
        initial={
          isHydrated
            ? { opacity: 0, x: initialX, scale: isMobile ? 1 : 0.97 }
            : false
        }
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
      </m.div>
    </LazyMotion>
  );
};

"use client";

import { domAnimation, LazyMotion, m } from "framer-motion";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { useNavigation } from "@/components/providers/navigation-provider";
import { usePathname } from "@/lib/site-navigation";

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
  const pathname = usePathname();
  const { direction } = useNavigation();
  const isMobile = useIsMobileNav();
  const initialX = getInitialX(isMobile, direction);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        key={pathname}
        className="origin-top"
        initial={{
          opacity: 0,
          x: initialX,
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
      </m.div>
    </LazyMotion>
  );
};

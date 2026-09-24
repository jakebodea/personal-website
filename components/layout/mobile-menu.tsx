"use client";

import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { useEffect, useRef } from "react";

import Link from "@/components/common/site-link";
import { usePathname } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ navItems, isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen ? (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.1, delay: 0.1 } }}
            className="fixed inset-0 z-[70] bg-background lg:hidden"
          >
            <div className="h-14" />

            <nav className="mx-auto flex w-full max-w-4xl flex-col px-6">
              {navItems.map((item, index) => (
                <m.div
                  key={item.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.15, delay: index * 0.03 },
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    transition: {
                      duration: 0.1,
                      delay: (navItems.length - 1 - index) * 0.02,
                    },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                    className={cn(
                      "block py-4 text-2xl font-medium transition-colors",
                      isActive(item.href)
                        ? "text-accent"
                        : "text-muted-foreground active:text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </m.div>
              ))}
            </nav>
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
};

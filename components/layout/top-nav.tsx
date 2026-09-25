"use client";

import { domAnimation, LazyMotion, m } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

import { ShortcutTooltip } from "@/components/common/shortcut-tooltip";
import Link from "@/components/common/site-link";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useStickyTitle } from "@/components/providers/sticky-title-provider";
import { MenuIcon } from "@/components/ui/menu-icon";
import { TooltipProvider } from "@/components/ui/tooltip";
import { navItems } from "@/lib/nav-config";
import { usePathname, useSiteRouter } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

export const TopNav = () => {
  const pathname = usePathname();
  const router = useSiteRouter();
  const { hasStickyTitle } = useStickyTitle();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpenedOnPath, setMenuOpenedOnPath] = useState(pathname);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const isMobileMenuOpen = mobileMenuOpen && menuOpenedOnPath === pathname;
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const activeIndex = navItems.findIndex((item) => isActive(item.href));

  useEffect(() => {
    const container = navContainerRef.current;
    if (container === null || activeIndex === -1) {
      return;
    }
    const links = container.querySelectorAll<HTMLAnchorElement>("a");
    const activeLink = links[activeIndex];
    if (activeLink !== undefined) {
      setIndicator({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { target } = e;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      const num = Math.trunc(Number(e.key));
      if (num >= 1 && num <= navItems.length) {
        window.scrollTo(0, 0);
        void router.push(navItems[num - 1].href);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  const openMobileMenu = useCallback(() => {
    setMenuOpenedOnPath(pathname);
    setMobileMenuOpen(true);
  }, [pathname]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-[80] w-full",
          hasStickyTitle ? "bg-transparent" : "bg-background"
        )}
      >
        {hasStickyTitle ? null : (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 translate-y-full bg-gradient-to-b from-background to-transparent" />
        )}
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex h-14 items-center justify-center">
            <TooltipProvider delayDuration={300}>
              <div
                ref={navContainerRef}
                className="relative hidden items-center gap-1 lg:flex"
              >
                <LazyMotion features={domAnimation}>
                  <m.span
                    className="absolute bottom-0 top-0 rounded-md bg-accent/10"
                    animate={indicator}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                </LazyMotion>
                {navItems.map((item, index) => (
                  <ShortcutTooltip key={item.href} shortcut={String(index + 1)}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                      className={cn(
                        "relative whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors",
                        isActive(item.href)
                          ? "text-accent"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="relative z-10">{item.title}</span>
                    </Link>
                  </ShortcutTooltip>
                ))}

                <div className="ml-2 shrink-0">
                  <ThemeToggle shortcut="t" />
                </div>
              </div>
            </TooltipProvider>

            <div className="flex w-full items-center justify-end lg:hidden">
              <div className="-mr-2 flex items-center gap-2">
                <ThemeToggle iconSize="md" align="end" />
                <button
                  type="button"
                  onClick={() => {
                    if (isMobileMenuOpen) {
                      closeMobileMenu();
                    } else {
                      openMobileMenu();
                    }
                  }}
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <MenuIcon isOpen={isMobileMenuOpen} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        navItems={navItems}
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </>
  );
};

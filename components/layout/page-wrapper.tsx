"use client";

import { useEffect, useRef, useState } from "react";

import { PageTitle } from "@/components/layout/page-title";
import { useStickyTitle } from "@/components/providers/sticky-title-provider";

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const PageWrapper = ({
  title,
  subtitle,
  children,
}: PageWrapperProps) => {
  const { setHasStickyTitle } = useStickyTitle();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    setHasStickyTitle(true);
    return () => {
      setHasStickyTitle(false);
    };
  }, [setHasStickyTitle]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel === null) {
      return () => {
        /* No observer when sentinel is missing. */
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-4xl px-6 py-8">
        <div ref={sentinelRef} className="h-0" />
        <div className="relative sticky top-0 z-50 -mx-6 flex h-14 items-center bg-background px-6">
          {isStuck ? (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 translate-y-full bg-gradient-to-b from-background to-transparent" />
          ) : null}
          <PageTitle variant="page" className="!m-0">
            {title}
          </PageTitle>
        </div>
        {subtitle !== undefined && subtitle !== "" ? (
          <p className="mb-3 text-lg text-muted-foreground">{subtitle}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
};

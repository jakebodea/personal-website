"use client";

/* oxlint-disable prefer-arrow-callback -- memo uses named functions for react(function-component-definition) */

import type { CSSProperties, ElementType } from "react";
import { memo } from "react";

import { cn } from "@/lib/utils";

interface ShimmerProps {
  as?: ElementType;
  children?: string;
  className?: string;
  duration?: number;
  spread?: number;
}

interface ShimmerStyle extends CSSProperties {
  "--shimmer-duration"?: string;
  "--shimmer-spread"?: string;
}

export const Shimmer = memo(function Shimmer({
  as: Component = "p",
  children = "",
  className,
  duration = 2,
  spread,
}: ShimmerProps) {
  const calculatedSpread = spread ?? Math.max(children.length * 2, 36);
  const style: ShimmerStyle = {
    "--shimmer-duration": `${duration}s`,
    "--shimmer-spread": `${calculatedSpread}%`,
  };

  return (
    <Component
      className={cn("shimmer-text inline-block text-transparent", className)}
      style={style}
    >
      {children}
    </Component>
  );
});

Shimmer.displayName = "Shimmer";

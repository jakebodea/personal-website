"use client";

/* oxlint-disable prefer-arrow-callback -- forwardRef uses named functions for react(function-component-definition) */

import { Root as SeparatorRoot } from "@radix-ui/react-separator";
import { forwardRef } from "react";
import type { ElementRef, ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const Separator = forwardRef<
  ElementRef<typeof SeparatorRoot>,
  ComponentPropsWithoutRef<typeof SeparatorRoot>
>(function Separator(
  { className, orientation = "horizontal", decorative = true, ...props },
  ref
) {
  return (
    <SeparatorRoot
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  );
});
Separator.displayName = SeparatorRoot.displayName;

export { Separator };

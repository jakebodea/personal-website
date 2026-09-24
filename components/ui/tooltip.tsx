"use client";

/* oxlint-disable prefer-arrow-callback, unicorn/prefer-export-from -- styled TooltipContent wrapper */

import {
  Provider as TooltipProvider,
  Root as Tooltip,
  Trigger as TooltipTrigger,
  Portal as TooltipPortal,
  Content as TooltipContentPrimitive,
} from "@radix-ui/react-tooltip";
import { forwardRef } from "react";
import type { ElementRef, ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipContentPrimitive>,
  ComponentPropsWithoutRef<typeof TooltipContentPrimitive>
>(function TooltipContent({ className, sideOffset = 4, ...props }, ref) {
  return (
    <TooltipPortal>
      <TooltipContentPrimitive
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-[100] overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </TooltipPortal>
  );
});
TooltipContent.displayName = TooltipContentPrimitive.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

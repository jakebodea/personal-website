"use client";

/* oxlint-disable prefer-arrow-callback, unicorn/prefer-export-from -- sheet primitives add styling wrappers */

import {
  Root as Sheet,
  Trigger as SheetTrigger,
  Close as SheetClose,
  Portal as SheetPortal,
  Overlay as SheetOverlayPrimitive,
  Content as SheetContentPrimitive,
  Title as SheetTitlePrimitive,
  Description as SheetDescriptionPrimitive,
} from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { forwardRef } from "react";
import type {
  ElementRef,
  ComponentPropsWithoutRef,
  HTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

const SheetOverlay = forwardRef<
  ElementRef<typeof SheetOverlayPrimitive>,
  ComponentPropsWithoutRef<typeof SheetOverlayPrimitive>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <SheetOverlayPrimitive
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
      ref={ref}
    />
  );
});
SheetOverlay.displayName = SheetOverlayPrimitive.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetContentProps
  extends
    ComponentPropsWithoutRef<typeof SheetContentPrimitive>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = forwardRef<
  ElementRef<typeof SheetContentPrimitive>,
  SheetContentProps
>(function SheetContent(
  { side = "right", className, children, ...props },
  ref
) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetContentPrimitive
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </SheetContentPrimitive>
    </SheetPortal>
  );
});
SheetContent.displayName = SheetContentPrimitive.displayName;

const SheetHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = forwardRef<
  ElementRef<typeof SheetTitlePrimitive>,
  ComponentPropsWithoutRef<typeof SheetTitlePrimitive>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <SheetTitlePrimitive
      ref={ref}
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
});
SheetTitle.displayName = SheetTitlePrimitive.displayName;

const SheetDescription = forwardRef<
  ElementRef<typeof SheetDescriptionPrimitive>,
  ComponentPropsWithoutRef<typeof SheetDescriptionPrimitive>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <SheetDescriptionPrimitive
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
SheetDescription.displayName = SheetDescriptionPrimitive.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};

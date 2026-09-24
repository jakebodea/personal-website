"use client";

/* oxlint-disable prefer-arrow-callback, unicorn/prefer-export-from -- forwardRef wrappers and styled Radix primitives */

import {
  Root as DropdownMenu,
  Trigger as DropdownMenuTrigger,
  Group as DropdownMenuGroup,
  Portal as DropdownMenuPortal,
  Sub as DropdownMenuSub,
  RadioGroup as DropdownMenuRadioGroup,
  SubTrigger as DropdownMenuSubTriggerPrimitive,
  SubContent as DropdownMenuSubContentPrimitive,
  Content as DropdownMenuContentPrimitive,
  Item as DropdownMenuItemPrimitive,
  CheckboxItem as DropdownMenuCheckboxItemPrimitive,
  RadioItem as DropdownMenuRadioItemPrimitive,
  Label as DropdownMenuLabelPrimitive,
  Separator as DropdownMenuSeparatorPrimitive,
  ItemIndicator as DropdownMenuItemIndicator,
} from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { forwardRef } from "react";
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof DropdownMenuSubTriggerPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuSubTriggerPrimitive> & {
    inset?: boolean;
  }
>(function DropdownMenuSubTrigger(
  { className, inset, children, ...props },
  ref
) {
  return (
    <DropdownMenuSubTriggerPrimitive
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset === true && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </DropdownMenuSubTriggerPrimitive>
  );
});
DropdownMenuSubTrigger.displayName =
  DropdownMenuSubTriggerPrimitive.displayName;

const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof DropdownMenuSubContentPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuSubContentPrimitive>
>(function DropdownMenuSubContent({ className, ...props }, ref) {
  return (
    <DropdownMenuSubContentPrimitive
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] origin-[--radix-dropdown-menu-content-transform-origin] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName =
  DropdownMenuSubContentPrimitive.displayName;

const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuContentPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuContentPrimitive>
>(function DropdownMenuContent({ className, sideOffset = 4, ...props }, ref) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuContentPrimitive
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] origin-[--radix-dropdown-menu-content-transform-origin] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPortal>
  );
});
DropdownMenuContent.displayName = DropdownMenuContentPrimitive.displayName;

const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuItemPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuItemPrimitive> & {
    inset?: boolean;
  }
>(function DropdownMenuItem({ className, inset, ...props }, ref) {
  return (
    <DropdownMenuItemPrimitive
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset === true && "pl-8",
        className
      )}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = DropdownMenuItemPrimitive.displayName;

const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuCheckboxItemPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItemPrimitive>
>(function DropdownMenuCheckboxItem(
  { className, children, checked, ...props },
  ref
) {
  return (
    <DropdownMenuCheckboxItemPrimitive
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuItemIndicator>
      </span>
      {children}
    </DropdownMenuCheckboxItemPrimitive>
  );
});
DropdownMenuCheckboxItem.displayName =
  DropdownMenuCheckboxItemPrimitive.displayName;

const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof DropdownMenuRadioItemPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuRadioItemPrimitive>
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <DropdownMenuRadioItemPrimitive
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuItemIndicator>
      </span>
      {children}
    </DropdownMenuRadioItemPrimitive>
  );
});
DropdownMenuRadioItem.displayName = DropdownMenuRadioItemPrimitive.displayName;

const DropdownMenuLabel = forwardRef<
  ElementRef<typeof DropdownMenuLabelPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuLabelPrimitive> & {
    inset?: boolean;
  }
>(function DropdownMenuLabel({ className, inset, ...props }, ref) {
  return (
    <DropdownMenuLabelPrimitive
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset === true && "pl-8",
        className
      )}
      {...props}
    />
  );
});
DropdownMenuLabel.displayName = DropdownMenuLabelPrimitive.displayName;

const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuSeparatorPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuSeparatorPrimitive>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <DropdownMenuSeparatorPrimitive
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
});
DropdownMenuSeparator.displayName = DropdownMenuSeparatorPrimitive.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    {...props}
  />
);

DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};

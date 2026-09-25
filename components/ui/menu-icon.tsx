"use client";

import { cn } from "@/lib/utils";

interface MenuIconProps {
  isOpen: boolean;
  className?: string;
}

const MenuIcon = ({ isOpen, className }: MenuIconProps) => (
  <div
    className={cn("relative flex h-5 w-5 flex-col justify-center", className)}
  >
    <span
      className={cn(
        "absolute h-[1.5px] w-full bg-muted-foreground transition-all duration-150",
        isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[6px]"
      )}
    />
    <span
      className={cn(
        "absolute h-[1.5px] w-full bg-muted-foreground transition-all duration-150",
        isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[6px]"
      )}
    />
  </div>
);

export { MenuIcon };

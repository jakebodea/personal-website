"use client";

import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

const isToasterTheme = (
  value: string | undefined
): value is NonNullable<ToasterProps["theme"]> =>
  value === "dark" || value === "light" || value === "system";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const resolvedTheme = isToasterTheme(theme) ? theme : "system";

  return (
    <Sonner
      theme={resolvedTheme}
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "relative group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-sm",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:font-medium",
          closeButton:
            "absolute top-2 right-2 left-auto translate-x-0 translate-y-0 opacity-80 text-card-foreground hover:opacity-100 transition-colors",
        },
        style: {
          fontSize: "16px",
          fontWeight: "500",
        },
      }}
      closeButton
      {...props}
    />
  );
};

export { Toaster };

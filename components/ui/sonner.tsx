"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "relative group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-2 group-[.toaster]:border-primary/20 group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 group-[.toast]:font-semibold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80",
          closeButton:
            "absolute top-2 right-2 left-auto translate-x-0 translate-y-0 opacity-80 text-card-foreground hover:opacity-100 transition-colors",
          success: "group-[.toaster]:bg-primary/10 group-[.toaster]:border-primary group-[.toaster]:text-primary-foreground",
          error: "group-[.toaster]:bg-destructive/10 group-[.toaster]:border-destructive group-[.toaster]:text-destructive-foreground",
          warning: "group-[.toaster]:bg-amber-500/10 group-[.toaster]:border-amber-500 group-[.toaster]:text-amber-700 dark:group-[.toaster]:text-amber-300",
          info: "group-[.toaster]:bg-accent/10 group-[.toaster]:border-accent group-[.toaster]:text-accent-foreground",
        },
        style: {
          fontSize: "16px",
          fontWeight: "500",
        },
      }}
      closeButton
      {...props}
    />
  )
}

export { Toaster }

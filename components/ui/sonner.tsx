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
            "relative group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:font-medium",
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
  )
}

export { Toaster }

"use client"

import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

interface ShortcutTooltipProps {
  shortcut: string
  children: React.ReactNode
  disabled?: boolean
}

export function ShortcutTooltip({ shortcut, children, disabled }: ShortcutTooltipProps) {
  const isMobile = useIsMobile()

  // On mobile screens, just render children without tooltip
  if (isMobile) {
    return <>{children}</>
  }

  return (
    <Tooltip open={disabled ? false : undefined}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <span className="flex items-center gap-1.5">
          press <Kbd>{shortcut}</Kbd>
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

"use client"

import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ShortcutTooltipProps {
  shortcut: string
  children: React.ReactNode
}

export function ShortcutTooltip({ shortcut, children }: ShortcutTooltipProps) {
  return (
    <Tooltip>
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

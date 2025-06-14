'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface CopyMarkdownButtonProps {
  content: string
  className?: string
}

export function CopyMarkdownButton({ content, className }: CopyMarkdownButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="icon"
            className={cn(
              'text-muted-foreground hover:text-foreground',
              'hover:bg-[#D5DDDF] active:bg-[#96AAAE]',
              'dark:hover:bg-accent/50 dark:active:bg-accent/70',
              className
            )}
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? 'Copied!' : 'Copy post as Markdown'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CopyMarkdownButtonProps {
  content: string;
  className?: string;
}

export const CopyMarkdownButton = ({
  content,
  className,
}: CopyMarkdownButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(content);
        setIsCopied(true);
        window.setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } catch {
        // Clipboard access denied or unavailable.
      }
    })();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            onClick={handleCopy}
            variant="ghost"
            size="icon"
            className={cn(
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted/20 active:bg-muted/50",
              className
            )}
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? "Copied!" : "Copy post as Markdown"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

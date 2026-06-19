"use client"

import type { UIMessage } from "ai"
import { Check, Copy, RefreshCw } from "lucide-react"
import { useState } from "react"

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getMessageMarkdown } from "@/lib/jake-chat/message-markdown"

interface ChatMessageProps {
  isBusy: boolean
  isLatestAssistant: boolean
  message: UIMessage
  onRetry: () => void
}

export function ChatMessage({
  isBusy,
  isLatestAssistant,
  message,
  onRetry,
}: ChatMessageProps) {
  const text = getMessageMarkdown(message)

  return (
    <Message from={message.role}>
      <MessageContent from={message.role}>
        {message.parts.map((part, index) => {
          if (part.type !== "text") return null

          if (message.role === "assistant") {
            return <MessageResponse key={index}>{part.text}</MessageResponse>
          }

          return <span key={index}>{part.text}</span>
        })}
      </MessageContent>
      {message.role === "assistant" && text && (
        <AssistantMessageActions
          canRetry={isLatestAssistant}
          content={text}
          isBusy={isBusy}
          onRetry={onRetry}
        />
      )}
    </Message>
  )
}

export function ThinkingMessage() {
  return (
    <Message from="assistant">
      <MessageContent className="py-1" from="assistant">
        <Shimmer as="span" className="text-sm" duration={1.35}>
          thinking...
        </Shimmer>
      </MessageContent>
    </Message>
  )
}

function AssistantMessageActions({
  canRetry,
  content,
  isBusy,
  onRetry,
}: {
  canRetry: boolean
  content: string
  isBusy: boolean
  onRetry: () => void
}) {
  const [isCopied, setIsCopied] = useState(false)

  function copyMarkdown() {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), 1600)
    })
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 opacity-70 transition-opacity hover:opacity-100">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="copy response as markdown"
              className="size-7 rounded-full text-muted-foreground hover:bg-card-02 hover:text-foreground"
              onClick={copyMarkdown}
              size="icon"
              type="button"
              variant="ghost"
            >
              {isCopied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isCopied ? "copied" : "copy markdown"}</TooltipContent>
        </Tooltip>

        {canRetry && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="retry response"
                className="size-7 rounded-full text-muted-foreground hover:bg-card-02 hover:text-foreground"
                disabled={isBusy}
                onClick={onRetry}
                size="icon"
                type="button"
                variant="ghost"
              >
                <RefreshCw className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>retry</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}

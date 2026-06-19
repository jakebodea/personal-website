"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { Check, Copy, MessageCirclePlus, RefreshCw } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { FollowUpPills } from "@/components/jake-chat/follow-up-pills"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { fallbackFollowUps, initialFollowUps } from "@/lib/jake-chat/follow-ups"
import type { FollowUp } from "@/lib/jake-chat/types"
import { cn } from "@/lib/utils"

interface JakeChatProps {
  variant?: "page" | "widget"
  className?: string
}

export function JakeChat({ variant = "page", className }: JakeChatProps) {
  const [input, setInput] = useState("")
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps)
  const [isLoadingFollowUps, setIsLoadingFollowUps] = useState(false)
  const [isConversationCopied, setIsConversationCopied] = useState(false)
  const lastFollowUpMessageId = useRef<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollEndRef = useRef<HTMLDivElement>(null)

  const { messages, regenerate, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isBusy = status === "submitted" || status === "streaming"
  const lastAssistantMessage = useMemo(
    () => messages.findLast((message) => message.role === "assistant"),
    [messages]
  )

  useEffect(() => {
    if (
      status !== "ready" ||
      !lastAssistantMessage ||
      lastFollowUpMessageId.current === lastAssistantMessage.id
    ) {
      return
    }

    lastFollowUpMessageId.current = lastAssistantMessage.id
    setIsLoadingFollowUps(true)

    fetch("/api/chat/follow-ups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("failed to load follow ups")
        return response.json() as Promise<{ followUps: FollowUp[] }>
      })
      .then((data) => setFollowUps(data.followUps))
      .catch(() => setFollowUps(fallbackFollowUps))
      .finally(() => setIsLoadingFollowUps(false))
  }, [lastAssistantMessage, messages, status])

  useEffect(() => {
    const scrollToEnd = () => {
      const scrollContainer = scrollContainerRef.current
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
      scrollEndRef.current?.scrollIntoView({
        behavior: status === "streaming" ? "auto" : "smooth",
        block: "end",
      })
    }

    scrollToEnd()
    const frame = requestAnimationFrame(scrollToEnd)
    const timeout = window.setTimeout(scrollToEnd, 100)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [followUps, messages, status])

  function submitPrompt(prompt: string) {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || isBusy) return
    sendMessage({ text: trimmedPrompt })
    setInput("")
  }

  function startNewConversation() {
    setMessages([])
    setInput("")
    setFollowUps(initialFollowUps)
    setIsLoadingFollowUps(false)
    lastFollowUpMessageId.current = null
  }

  function copyConversation() {
    const markdown = messages
      .map((message) => {
        const label = message.role === "user" ? "you" : "jake-ish"
        return `### ${label}\n\n${getMessageMarkdown(message)}`
      })
      .filter((entry) => entry.trim())
      .join("\n\n")

    if (!markdown) return

    navigator.clipboard.writeText(markdown).then(() => {
      setIsConversationCopied(true)
      window.setTimeout(() => setIsConversationCopied(false), 1600)
    })
  }

  return (
    <section
      className={cn(
        "mx-auto flex w-full flex-col",
        variant === "page"
          ? "h-[calc(100vh-3.5rem)] max-w-2xl px-6 pb-5 pt-10"
          : "h-full max-w-full",
        className
      )}
    >
      <div className="flex shrink-0 justify-end gap-1.5">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="copy conversation as markdown"
                className="size-8 shrink-0 rounded-full text-muted-foreground/70 hover:bg-card-02 hover:text-foreground"
                disabled={messages.length === 0}
                onClick={copyConversation}
                size="icon"
                type="button"
                variant="ghost"
              >
                {isConversationCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isConversationCopied ? "copied" : "copy conversation"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="start a new conversation"
                className="size-8 shrink-0 rounded-full text-muted-foreground/70 hover:bg-card-02 hover:text-foreground"
                disabled={isBusy && messages.length === 0}
                onClick={startNewConversation}
                size="icon"
                type="button"
                variant="ghost"
              >
                <MessageCirclePlus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>new conversation</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div
        ref={scrollContainerRef}
        className="scrollbar-thin -mx-2 mt-2 min-h-0 flex-1 overflow-y-auto px-2"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-end pb-4 text-sm text-muted-foreground">
            what would you want to ask me?
          </div>
        ) : (
          <div className="flex flex-col gap-5 pb-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                isLatestAssistant={message.id === lastAssistantMessage?.id}
                isBusy={isBusy}
                message={message}
                onRetry={() => regenerate()}
              />
            ))}
            {status === "submitted" && <ThinkingMessage />}
            <div ref={scrollEndRef} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="shrink-0 space-y-3 pt-3">
        <FollowUpPills
          disabled={isBusy || isLoadingFollowUps}
          followUps={followUps}
          loading={isLoadingFollowUps}
          onSend={submitPrompt}
        />

        <PromptInput
          onSubmit={(event) => {
            event.preventDefault()
            submitPrompt(input)
          }}
        >
          <PromptInputTextarea
            disabled={isBusy}
            placeholder="ask about jake..."
            value={input}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                submitPrompt(input)
              }
            }}
            onChange={(event) => setInput(event.target.value)}
          />
          <PromptInputSubmit disabled={isBusy || !input.trim()} />
        </PromptInput>
      </div>
    </section>
  )
}

function ThinkingMessage() {
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

function ChatMessage({
  isBusy,
  isLatestAssistant,
  message,
  onRetry,
}: {
  isBusy: boolean
  isLatestAssistant: boolean
  message: UIMessage
  onRetry: () => void
}) {
  const text = getMessageMarkdown(message)

  return (
    <Message from={message.role}>
      <MessageContent from={message.role}>
        {message.parts.map((part, index) => {
          if (part.type !== "text") return null

          if (message.role === "assistant") {
            return (
              <MessageResponse key={index}>
                {part.text}
              </MessageResponse>
            )
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
          <TooltipContent>
            {isCopied ? "copied" : "copy markdown"}
          </TooltipContent>
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

function getMessageMarkdown(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim()
}

"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Check, Copy, Info, MessageCirclePlus, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"
import {
  ChatMessage,
  ThinkingMessage,
} from "@/components/jake-chat/chat-message"
import { FollowUpPills } from "@/components/jake-chat/follow-up-pills"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { fallbackFollowUps, initialFollowUps } from "@/lib/jake-chat/follow-ups"
import { getMessageMarkdown } from "@/lib/jake-chat/message-markdown"
import type { FollowUp } from "@/lib/jake-chat/types"
import { cn } from "@/lib/utils"

interface JakeChatProps {
  variant?: "page" | "widget"
  className?: string
  onClose?: () => void
}

export function JakeChat({
  variant = "page",
  className,
  onClose,
}: JakeChatProps) {
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
      <div className="flex shrink-0 items-center justify-between gap-3">
        {variant === "widget" ? (
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <Image
              alt="Jake Bodea"
              className="size-7 shrink-0 rounded-full border border-border/70 object-cover object-[50%_24%]"
              height={28}
              src="/images/jake-chat-avatar.jpeg"
              unoptimized
              width={28}
            />
            <span className="truncate">ask jake</span>
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <button
                  aria-label="show chat provider"
                  className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 outline-none transition-colors hover:bg-card-02 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  type="button"
                >
                  <Info className="size-3.5" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-auto p-3"
                side="bottom"
              >
                <div className="flex flex-col gap-1.5 text-xs leading-none">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>powered by</span>
                    <a
                      aria-label="Visit Groq"
                      className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      href="https://groq.com/"
                      onClick={(event) => {
                        event.preventDefault()
                        window.open(
                          "https://groq.com/",
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Image
                        alt="Groq"
                        className="h-3.5 w-auto dark:invert"
                        height={14}
                        src="/images/groq-logo.svg"
                        width={38}
                      />
                    </a>
                  </div>
                  <span className="text-muted-foreground">paid for by me</span>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        ) : (
          <div aria-hidden="true" />
        )}

        <TooltipProvider delayDuration={200}>
          <div className="flex shrink-0 justify-end gap-1.5">
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
            {variant === "widget" && onClose && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="close chat"
                    className="size-8 shrink-0 rounded-full text-muted-foreground/70 hover:bg-card-02 hover:text-foreground"
                    onClick={onClose}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <X className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>close chat</TooltipContent>
              </Tooltip>
            )}
          </div>
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

"use client"

import { cjk } from "@streamdown/cjk"
import { code } from "@streamdown/code"
import { math } from "@streamdown/math"
import { mermaid } from "@streamdown/mermaid"
import type { UIMessage } from "ai"
import type { ComponentProps, HTMLAttributes } from "react"
import { memo } from "react"
import { Streamdown, type PluginConfig } from "streamdown"

import { cn } from "@/lib/utils"

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"]
}

export function Message({ className, from, ...props }: MessageProps) {
  return (
    <div
      className={cn(
        "group flex w-full flex-col gap-2",
        from === "user" ? "items-end" : "items-start",
        className
      )}
      {...props}
    />
  )
}

export type MessageContentProps = HTMLAttributes<HTMLDivElement> & {
  from?: UIMessage["role"]
}

export function MessageContent({
  className,
  from = "assistant",
  ...props
}: MessageContentProps) {
  return (
    <div
      className={cn(
        "min-w-0 max-w-full text-sm leading-relaxed",
        from === "user"
          ? "w-fit max-w-[82%] rounded-md bg-card-03 px-3.5 py-2.5 text-foreground"
          : "w-full text-foreground",
        className
      )}
      {...props}
    />
  )
}

export type MessageResponseProps = ComponentProps<typeof Streamdown>

const streamdownPlugins = { cjk, code, math, mermaid } as unknown as PluginConfig

export const MessageResponse = memo(
  ({ className, ...props }: MessageResponseProps) => (
    <Streamdown
      className={cn(
        "markdown-content size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      plugins={streamdownPlugins}
      {...props}
    />
  ),
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.isAnimating === nextProps.isAnimating
)

MessageResponse.displayName = "MessageResponse"

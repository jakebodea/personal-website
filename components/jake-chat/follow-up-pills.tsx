"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { fillPromptTemplate } from "@/lib/jake-chat/follow-ups"
import type { FollowUp } from "@/lib/jake-chat/types"
import { cn } from "@/lib/utils"

interface FollowUpPillsProps {
  followUps: FollowUp[]
  disabled?: boolean
  loading?: boolean
  onSend: (prompt: string) => void
}

export function FollowUpPills({
  followUps,
  disabled,
  loading,
  onSend,
}: FollowUpPillsProps) {
  if (!followUps.length && !loading) return null

  return (
    <div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max min-w-full items-center gap-2">
        {loading && <FollowUpLoadingPills />}
        {!loading &&
          followUps.map((followUp) => {
          if (followUp.type === "button") {
            return (
              <PillButton
                key={followUp.id}
                disabled={disabled}
                onClick={() => onSend(followUp.prompt)}
              >
                {followUp.title}
              </PillButton>
            )
          }

          if (followUp.type === "select") {
            return (
              <SelectFollowUp
                key={followUp.id}
                disabled={disabled}
                followUp={followUp}
                onSend={onSend}
              />
            )
          }

          return null
          })}
      </div>
    </div>
  )
}

function PillButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "h-8 rounded-full border-border/80 bg-transparent px-3 text-xs text-muted-foreground hover:bg-card-02 hover:text-foreground",
        className
      )}
      size="sm"
      type="button"
      variant="outline"
      {...props}
    />
  )
}

function FollowUpLoadingPills() {
  return (
    <>
      <span className="shimmer-fill h-8 w-20 shrink-0 rounded-full border border-border/60 bg-card-02/70" />
      <span className="shimmer-fill h-8 w-28 shrink-0 rounded-full border border-border/60 bg-card-02/70" />
      <span className="shimmer-fill h-8 w-24 shrink-0 rounded-full border border-border/60 bg-card-02/70" />
    </>
  )
}

function SelectFollowUp({
  disabled,
  followUp,
  onSend,
}: {
  disabled?: boolean
  followUp: Extract<FollowUp, { type: "select" }>
  onSend: (prompt: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <HoverCard closeDelay={120} open={isOpen} openDelay={100000}>
      <HoverCardTrigger asChild>
        <PillButton
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => setIsOpen((open) => !open)}
        >
          {followUp.title}
          <ChevronDown className="size-3.5" />
        </PillButton>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="w-72 rounded-md p-2"
        side="top"
        sideOffset={8}
        onEscapeKeyDown={() => setIsOpen(false)}
        onPointerDownOutside={() => setIsOpen(false)}
      >
        <SelectFollowUpInput
          followUp={followUp}
          onCancel={() => setIsOpen(false)}
          onSend={(prompt) => {
            onSend(prompt)
            setIsOpen(false)
          }}
        />
      </HoverCardContent>
    </HoverCard>
  )
}

function SelectFollowUpInput({
  followUp,
  onCancel,
  onSend,
}: {
  followUp: Extract<FollowUp, { type: "select" }>
  onCancel: () => void
  onSend: (prompt: string) => void
}) {
  const [value, setValue] = useState("")

  function submitValue(nextValue: string) {
    const trimmedValue = nextValue.trim()
    if (!trimmedValue) return
    onSend(fillPromptTemplate(followUp.promptTemplate, trimmedValue))
  }

  return (
    <div className="space-y-1">
      <div className="flex flex-col">
        {followUp.options.map((option) => (
          <button
            key={option.value}
            className="rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-card-02 hover:text-foreground"
            type="button"
            onClick={() => submitValue(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <form
        className="pt-1"
        onSubmit={(event) => {
          event.preventDefault()
          submitValue(value)
        }}
      >
        <Input
          className="h-8 rounded-md border-border/70 bg-card/70 px-2 text-xs shadow-none placeholder:text-muted-foreground/55 focus-visible:ring-1 focus-visible:ring-accent/40 focus-visible:ring-offset-0"
          placeholder={followUp.customLabel ?? "type an answer"}
          value={value}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              onCancel()
            }
          }}
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
    </div>
  )
}

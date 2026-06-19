"use client"

import { ArrowUp } from "lucide-react"
import {
  forwardRef,
  useEffect,
  useRef,
  type ComponentProps,
  type ChangeEvent,
  type FormHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PromptInputProps = FormHTMLAttributes<HTMLFormElement>

export function PromptInput({ className, ...props }: PromptInputProps) {
  return (
    <form
      className={cn(
        "relative flex min-h-12 rounded-[1.5rem] border border-border/80 bg-card/80 px-2.5 py-2 shadow-sm shadow-black/5 transition-colors focus-within:border-accent/50 focus-within:bg-card-02/90 dark:bg-card-02/70 dark:shadow-black/20 dark:focus-within:bg-card-03/80",
        className
      )}
      {...props}
    />
  )
}

export type PromptInputTextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement>

export const PromptInputTextarea = forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(({ className, onChange, onKeyDown, value, ...props }, ref) => {
  const innerRef = useRef<HTMLTextAreaElement | null>(null)

  function setRefs(node: HTMLTextAreaElement | null) {
    innerRef.current = node

    if (typeof ref === "function") {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  function resizeTextarea() {
    const textarea = innerRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
  }

  useEffect(() => {
    resizeTextarea()
  }, [value])

  return (
    <textarea
      ref={setRefs}
      rows={1}
      value={value}
      className={cn(
        "scrollbar-thin max-h-32 min-h-8 flex-1 resize-none overflow-y-auto border-0 bg-transparent py-1.5 pl-2 pr-11 text-[15px] leading-5 text-foreground outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(event)
        requestAnimationFrame(resizeTextarea)
      }}
      onKeyDown={onKeyDown}
      {...props}
    />
  )
})

PromptInputTextarea.displayName = "PromptInputTextarea"

export type PromptInputSubmitProps = ComponentProps<typeof Button>

export function PromptInputSubmit({
  className,
  children,
  ...props
}: PromptInputSubmitProps) {
  return (
    <Button
      aria-label="send message"
      className={cn(
        "absolute bottom-2 right-2 size-8 shrink-0 rounded-full bg-accent text-accent-foreground shadow-sm transition-transform hover:bg-accent/90 active:scale-95 disabled:scale-100 disabled:border disabled:border-border/70 disabled:bg-card-04 disabled:text-muted-foreground/70 disabled:shadow-none",
        className
      )}
      size="icon"
      type="submit"
      {...props}
    >
      {children ?? <ArrowUp className="size-4" strokeWidth={2.5} />}
    </Button>
  )
}

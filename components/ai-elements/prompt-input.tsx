"use client";

/* oxlint-disable prefer-arrow-callback -- forwardRef uses named functions for react(function-component-definition) */

import { ArrowUp } from "lucide-react";
import { forwardRef, useCallback, useRef } from "react";
import type {
  ComponentProps,
  ChangeEvent,
  FormHTMLAttributes,
  MutableRefObject,
  Ref,
  TextareaHTMLAttributes,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PromptInputProps = FormHTMLAttributes<HTMLFormElement>;

export const PromptInput = ({ className, ...props }: PromptInputProps) => (
  <form
    className={cn(
      "relative flex min-h-12 rounded-[1.5rem] border border-border/80 bg-card/80 px-2.5 py-2 shadow-sm shadow-black/5 transition-colors focus-within:border-accent/50 focus-within:bg-card-02/90 dark:bg-card-02/70 dark:shadow-black/20 dark:focus-within:bg-card-03/80",
      className
    )}
    {...props}
  />
);

export type PromptInputTextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement>;

const assignTextareaRef = (
  ref: Ref<HTMLTextAreaElement> | undefined,
  node: HTMLTextAreaElement | null
) => {
  if (ref === undefined || ref === null) {
    return;
  }

  if ("current" in ref) {
    // SAFETY: React object refs are writable at runtime; RefObject.current is typed readonly
    (ref as MutableRefObject<HTMLTextAreaElement | null>).current = node;
    return;
  }

  ref(node);
};

export const PromptInputTextarea = forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(function PromptInputTextarea(
  { className, onChange, onKeyDown, value, ...props },
  ref
) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = useCallback(() => {
    const textarea = innerRef.current;
    if (textarea === null) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  }, []);

  const setRefs = (node: HTMLTextAreaElement | null) => {
    innerRef.current = node;
    assignTextareaRef(ref, node);
    if (node !== null) {
      requestAnimationFrame(resizeTextarea);
    }
  };

  return (
    <textarea
      ref={setRefs}
      rows={1}
      value={value}
      className={cn(
        "scrollbar-thin max-h-32 min-h-8 flex-1 resize-none overflow-y-auto border-0 bg-transparent py-1.5 pl-2 pr-11 text-[15px] leading-5 text-foreground outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60",
        (value === undefined || value === "") && "h-8",
        className
      )}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(event);
        requestAnimationFrame(resizeTextarea);
      }}
      onKeyDown={onKeyDown}
      {...props}
    />
  );
});

PromptInputTextarea.displayName = "PromptInputTextarea";

export type PromptInputSubmitProps = ComponentProps<typeof Button>;

export const PromptInputSubmit = ({
  className,
  children,
  ...props
}: PromptInputSubmitProps) => (
  <Button
    aria-label="Send message"
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
);

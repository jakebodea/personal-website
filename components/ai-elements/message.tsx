"use client";

/* oxlint-disable prefer-arrow-callback -- memo uses named functions for react(function-component-definition) */

import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import type { UIMessage } from "ai";
import type { ComponentProps, HTMLAttributes } from "react";
import { memo } from "react";
import { Streamdown } from "streamdown";

import { cn } from "@/lib/utils";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full flex-col gap-2",
      from === "user" ? "items-end" : "items-start",
      className
    )}
    {...props}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement> & {
  from?: UIMessage["role"];
};

export const MessageContent = ({
  className,
  from = "assistant",
  ...props
}: MessageContentProps) => (
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
);

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

const streamdownPlugins = {
  cjk,
  code,
  math,
  mermaid,
};

export const MessageResponse = memo(
  function MessageResponse({ className, ...props }: MessageResponseProps) {
    return (
      <Streamdown
        className={cn(
          "markdown-content size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          className
        )}
        // @ts-expect-error -- @streamdown/* plugins type against a different unified major than streamdown
        plugins={streamdownPlugins}
        {...props}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.isAnimating === nextProps.isAnimating
);

MessageResponse.displayName = "MessageResponse";

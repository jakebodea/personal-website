"use client";

import type { UIMessage } from "ai";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMessageMarkdown } from "@/lib/jake-chat/message-markdown";

interface ChatMessageProps {
  isBusy: boolean;
  isLatestAssistant: boolean;
  message: UIMessage;
  onRetry: () => void;
}

const AssistantMessageActions = ({
  canRetry,
  content,
  isBusy,
  onRetry,
}: {
  canRetry: boolean;
  content: string;
  isBusy: boolean;
  onRetry: () => void;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      window.setTimeout(() => {
        setIsCopied(false);
      }, 1600);
    } catch {
      // Clipboard access can fail in restrictive browser contexts.
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 opacity-70 transition-opacity hover:opacity-100">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Copy response as markdown"
              className="size-7 rounded-full text-muted-foreground hover:bg-card-02 hover:text-foreground"
              onClick={() => {
                void copyMarkdown();
              }}
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

        {canRetry ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Retry response"
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
        ) : null}
      </div>
    </TooltipProvider>
  );
};

export const ChatMessage = ({
  isBusy,
  isLatestAssistant,
  message,
  onRetry,
}: ChatMessageProps) => {
  const text = getMessageMarkdown(message);

  return (
    <Message from={message.role}>
      <MessageContent from={message.role}>
        {message.parts.map((part) => {
          if (part.type !== "text") {
            return null;
          }

          const partKey = `${message.id}-${part.type}-${part.text}`;

          if (message.role === "assistant") {
            return <MessageResponse key={partKey}>{part.text}</MessageResponse>;
          }

          return <span key={partKey}>{part.text}</span>;
        })}
      </MessageContent>
      {message.role === "assistant" && text.length > 0 ? (
        <AssistantMessageActions
          canRetry={isLatestAssistant}
          content={text}
          isBusy={isBusy}
          onRetry={onRetry}
        />
      ) : null}
    </Message>
  );
};

export const ThinkingMessage = () => (
  <Message from="assistant">
    <MessageContent className="py-1" from="assistant">
      <Shimmer as="span" className="text-sm" duration={1.35}>
        thinking...
      </Shimmer>
    </MessageContent>
  </Message>
);

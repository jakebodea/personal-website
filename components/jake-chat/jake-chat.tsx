"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Check, Copy, Info, MessageCirclePlus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import Image from "@/components/common/site-image";
import {
  ChatMessage,
  ThinkingMessage,
} from "@/components/jake-chat/chat-message";
import { FollowUpPills } from "@/components/jake-chat/follow-up-pills";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  fallbackFollowUps,
  initialFollowUps,
} from "@/lib/jake-chat/follow-ups";
import { getMessageMarkdown } from "@/lib/jake-chat/message-markdown";
import type { FollowUp } from "@/lib/jake-chat/types";
import { cn } from "@/lib/utils";

const CHAT_CACHE_KEY = "jake-chat:messages";

interface JakeChatProps {
  variant?: "page" | "widget";
  className?: string;
  onClose?: () => void;
}

interface DivRef {
  current: HTMLDivElement | null;
}

const canUseBrowserStorage = () => "localStorage" in globalThis;

const isUIMessageRole = (role: string): role is UIMessage["role"] =>
  role === "user" || role === "assistant" || role === "system";

const isUIMessage = (message: unknown): message is UIMessage => {
  if (message === null || Array.isArray(message)) {
    return false;
  }

  if (!(message instanceof Object)) {
    return false;
  }

  if (!("id" in message) || !("role" in message) || !("parts" in message)) {
    return false;
  }

  const { id, parts, role } = message;

  return (
    typeof id === "string" &&
    typeof role === "string" &&
    isUIMessageRole(role) &&
    Array.isArray(parts)
  );
};

const getCachedMessages = (): UIMessage[] => {
  if (!canUseBrowserStorage()) {
    return [];
  }

  try {
    const cachedMessages = globalThis.localStorage.getItem(CHAT_CACHE_KEY);
    if (cachedMessages === null || cachedMessages.length === 0) {
      return [];
    }

    const parsedMessages: unknown = JSON.parse(cachedMessages);
    if (!Array.isArray(parsedMessages)) {
      return [];
    }

    return parsedMessages.filter(isUIMessage);
  } catch {
    return [];
  }
};

const cacheMessages = (messages: UIMessage[]) => {
  if (!canUseBrowserStorage()) {
    return;
  }

  try {
    if (messages.length === 0) {
      globalThis.localStorage.removeItem(CHAT_CACHE_KEY);
      return;
    }

    globalThis.localStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(messages));
  } catch {
    // Chat should keep working even if browser storage is unavailable.
  }
};

const showQueuedWarning = () => {
  toast("still working on it", {
    description:
      "The model provider is moving a little slowly, so your request is queued and should show up shortly.",
  });
};

const clearTimeoutRef = (timeoutRef: { current: number | null }) => {
  if (timeoutRef.current === null) {
    return;
  }

  window.clearTimeout(timeoutRef.current);
  timeoutRef.current = null;
};

const isFollowUpsResponse = (
  data: unknown
): data is { followUps: FollowUp[] } => {
  if (data === null || Array.isArray(data) || !(data instanceof Object)) {
    return false;
  }

  return "followUps" in data && Array.isArray(data.followUps);
};

const loadFollowUps = async (
  messages: UIMessage[],
  signal: AbortSignal
): Promise<FollowUp[]> => {
  const response = await fetch("/api/chat/follow-ups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!response.ok) {
    throw new Error("failed to load follow ups");
  }

  const data: unknown = await response.json();
  if (!isFollowUpsResponse(data)) {
    throw new Error("invalid follow ups response");
  }

  return data.followUps;
};

const scrollChatToEnd = (
  scrollContainerRef: DivRef,
  scrollEndRef: DivRef,
  behavior: ScrollBehavior
) => {
  const scrollContainer = scrollContainerRef.current;
  if (scrollContainer !== null) {
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }
  scrollEndRef.current?.scrollIntoView({ behavior, block: "end" });
};

const refreshFollowUpsAfterReply = async (
  allMessages: UIMessage[],
  requestGeneration: number,
  generationRef: { current: number },
  setFollowUps: (followUps: FollowUp[]) => void,
  setIsLoadingFollowUps: (loading: boolean) => void,
  scrollContainerRef: DivRef,
  scrollEndRef: DivRef
) => {
  setIsLoadingFollowUps(true);

  try {
    const nextFollowUps = await loadFollowUps(
      allMessages,
      new AbortController().signal
    );
    if (generationRef.current !== requestGeneration) {
      return;
    }
    setFollowUps(nextFollowUps);
    requestAnimationFrame(() => {
      scrollChatToEnd(scrollContainerRef, scrollEndRef, "smooth");
    });
  } catch {
    if (generationRef.current !== requestGeneration) {
      return;
    }
    setFollowUps(fallbackFollowUps);
    requestAnimationFrame(() => {
      scrollChatToEnd(scrollContainerRef, scrollEndRef, "smooth");
    });
  }

  if (generationRef.current === requestGeneration) {
    setIsLoadingFollowUps(false);
  }
};

const buildConversationMarkdown = (messages: UIMessage[]) => {
  const sections: string[] = [];

  for (const message of messages) {
    const body = getMessageMarkdown(message);
    if (body.length === 0) {
      continue;
    }

    const label = message.role === "user" ? "you" : "jake-ish";
    sections.push(`### ${label}\n\n${body}`);
  }

  return sections.join("\n\n");
};

const copyTextToClipboard = async (markdown: string) => {
  try {
    await navigator.clipboard.writeText(markdown);
  } catch {
    // Clipboard access can fail in restrictive browser contexts.
  }
};

interface JakeChatToolbarProps {
  isBusy: boolean;
  isConversationCopied: boolean;
  messagesCount: number;
  onClose?: () => void;
  onCopyConversation: () => void;
  onStartNewConversation: () => void;
  variant: "page" | "widget";
}

const JakeChatToolbar = ({
  isBusy,
  isConversationCopied,
  messagesCount,
  onClose,
  onCopyConversation,
  onStartNewConversation,
  variant,
}: JakeChatToolbarProps) => (
  <div className="flex shrink-0 items-center justify-between gap-3">
    {variant === "widget" ? (
      <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
        <Image
          alt="Jake Bodea"
          className="size-7 shrink-0 rounded-full border border-border/70 object-cover object-[50%_24%]"
          height={28}
          src="/images/jake-chat-avatar.jpeg"
          width={28}
        />
        <span className="truncate">ask jake</span>
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <button
              aria-label="Show chat provider"
              className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 outline-none transition-colors hover:bg-card-02 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              type="button"
            >
              <Info className="size-3.5" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-auto p-3" side="bottom">
            <div className="flex flex-col gap-1.5 text-xs leading-none">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span>powered by</span>
                <a
                  aria-label="Visit Cloudflare Workers AI"
                  className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  href="https://developers.cloudflare.com/workers-ai/"
                  onClick={(event) => {
                    event.preventDefault();
                    window.open(
                      "https://developers.cloudflare.com/workers-ai/",
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="font-medium text-foreground">
                    Cloudflare Workers AI
                  </span>
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
              aria-label="Copy conversation as markdown"
              className="size-8 shrink-0 rounded-full text-muted-foreground/70 hover:bg-card-02 hover:text-foreground"
              disabled={messagesCount === 0}
              onClick={onCopyConversation}
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
              aria-label="Start a new conversation"
              className="size-8 shrink-0 rounded-full text-muted-foreground/70 hover:bg-card-02 hover:text-foreground"
              disabled={isBusy && messagesCount === 0}
              onClick={onStartNewConversation}
              size="icon"
              type="button"
              variant="ghost"
            >
              <MessageCirclePlus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>new conversation</TooltipContent>
        </Tooltip>
        {variant === "widget" && onClose !== undefined ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Close chat"
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
        ) : null}
      </div>
    </TooltipProvider>
  </div>
);

interface JakeChatMessageListProps {
  isBusy: boolean;
  lastAssistantMessageId?: string;
  messages: UIMessage[];
  onRetryLatest: () => void;
  scrollContainerRef: DivRef;
  scrollEndRef: DivRef;
  status: string;
}

const JakeChatMessageList = ({
  isBusy,
  lastAssistantMessageId,
  messages,
  onRetryLatest,
  scrollContainerRef,
  scrollEndRef,
  status,
}: JakeChatMessageListProps) => (
  <div
    ref={(node) => {
      Object.assign(scrollContainerRef, { current: node });
    }}
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
            isLatestAssistant={message.id === lastAssistantMessageId}
            isBusy={isBusy}
            message={message}
            onRetry={onRetryLatest}
          />
        ))}
        {status === "submitted" ? <ThinkingMessage /> : null}
        <div
          ref={(node) => {
            Object.assign(scrollEndRef, { current: node });
          }}
          aria-hidden="true"
        />
      </div>
    )}
  </div>
);

export const JakeChat = ({
  variant = "page",
  className,
  onClose,
}: JakeChatProps) => {
  const initialMessages = useMemo(() => getCachedMessages(), []);
  const [input, setInput] = useState("");
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);
  const [isLoadingFollowUps, setIsLoadingFollowUps] = useState(false);
  const [isConversationCopied, setIsConversationCopied] = useState(false);
  const lastFollowUpMessageId = useRef<string | null>(null);
  const queuedRetryCount = useRef(0);
  const queuedRetryTimeout = useRef<number | null>(null);
  const queuedWarningTimeout = useRef<number | null>(null);
  const queuedWarningShown = useRef(false);
  const followUpRequestGeneration = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  const { clearError, messages, regenerate, sendMessage, setMessages, status } =
    useChat({
      id: "jake-chat",
      messages: initialMessages,
      transport: new DefaultChatTransport({ api: "/api/chat" }),
      onFinish: ({ isAbort, isError, message, messages: allMessages }) => {
        if (isAbort || isError || message.role !== "assistant") {
          return;
        }

        if (lastFollowUpMessageId.current === message.id) {
          return;
        }

        lastFollowUpMessageId.current = message.id;
        followUpRequestGeneration.current += 1;
        const requestGeneration = followUpRequestGeneration.current;

        void refreshFollowUpsAfterReply(
          allMessages,
          requestGeneration,
          followUpRequestGeneration,
          setFollowUps,
          setIsLoadingFollowUps,
          scrollContainerRef,
          scrollEndRef
        );
      },
      onError: () => {
        queuedWarningShown.current = true;
        showQueuedWarning();

        clearError();

        if (
          queuedRetryCount.current >= 2 ||
          queuedRetryTimeout.current !== null
        ) {
          return;
        }

        queuedRetryCount.current += 1;
        queuedRetryTimeout.current = window.setTimeout(() => {
          queuedRetryTimeout.current = null;
          void regenerate();
        }, 12_000);
      },
    });

  const isBusy = status === "submitted" || status === "streaming";
  const lastAssistantMessage = useMemo(
    () => messages.findLast((message) => message.role === "assistant"),
    [messages]
  );

  useEffect(() => {
    cacheMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (!isBusy) {
      clearTimeoutRef(queuedWarningTimeout);
      queuedWarningShown.current = false;
    } else if (
      !queuedWarningShown.current &&
      queuedWarningTimeout.current === null
    ) {
      queuedWarningTimeout.current = window.setTimeout(() => {
        queuedWarningTimeout.current = null;
        queuedWarningShown.current = true;
        showQueuedWarning();
      }, 8000);
    }

    return () => {
      clearTimeoutRef(queuedWarningTimeout);
    };
  }, [isBusy]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const scrollToEnd = () => {
      scrollChatToEnd(scrollContainerRef, scrollEndRef, "auto");
    };

    scrollToEnd();

    const observer =
      scrollContainer === null ? null : new MutationObserver(scrollToEnd);

    if (observer !== null && scrollContainer !== null) {
      observer.observe(scrollContainer, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
    };
  }, []);

  const submitPrompt = (prompt: string) => {
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length === 0 || isBusy) {
      return;
    }
    clearTimeoutRef(queuedRetryTimeout);
    clearTimeoutRef(queuedWarningTimeout);
    queuedRetryCount.current = 0;
    queuedWarningShown.current = false;
    void sendMessage({ text: trimmedPrompt });
    setInput("");
  };

  const startNewConversation = () => {
    clearTimeoutRef(queuedRetryTimeout);
    clearTimeoutRef(queuedWarningTimeout);
    queuedRetryCount.current = 0;
    queuedWarningShown.current = false;
    setMessages([]);
    cacheMessages([]);
    setInput("");
    setFollowUps(initialFollowUps);
    setIsLoadingFollowUps(false);
    lastFollowUpMessageId.current = null;
  };

  const handleCopyConversation = () => {
    const markdown = buildConversationMarkdown(messages);
    if (markdown.length === 0) {
      return;
    }

    void (async () => {
      await copyTextToClipboard(markdown);
      setIsConversationCopied(true);
      window.setTimeout(() => {
        setIsConversationCopied(false);
      }, 1600);
    })();
  };

  const handleRetryLatest = () => {
    void regenerate();
  };

  useEffect(
    () => () => {
      clearTimeoutRef(queuedRetryTimeout);
      clearTimeoutRef(queuedWarningTimeout);
    },
    []
  );

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
      <JakeChatToolbar
        isBusy={isBusy}
        isConversationCopied={isConversationCopied}
        messagesCount={messages.length}
        onClose={onClose}
        onCopyConversation={handleCopyConversation}
        onStartNewConversation={startNewConversation}
        variant={variant}
      />

      <JakeChatMessageList
        isBusy={isBusy}
        lastAssistantMessageId={lastAssistantMessage?.id}
        messages={messages}
        onRetryLatest={handleRetryLatest}
        scrollContainerRef={scrollContainerRef}
        scrollEndRef={scrollEndRef}
        status={status}
      />

      <div className="shrink-0 space-y-3 pt-3">
        <FollowUpPills
          disabled={isBusy || isLoadingFollowUps}
          followUps={followUps}
          loading={isLoadingFollowUps}
          onSend={submitPrompt}
        />

        <PromptInput
          onSubmit={(event) => {
            event.preventDefault();
            submitPrompt(input);
          }}
        >
          <PromptInputTextarea
            disabled={isBusy}
            placeholder="ask about jake..."
            value={input}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitPrompt(input);
              }
            }}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
          <PromptInputSubmit disabled={isBusy || input.trim().length === 0} />
        </PromptInput>
      </div>
    </section>
  );
};

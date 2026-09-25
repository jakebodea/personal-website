"use client";

import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

import { JakeChat } from "@/components/jake-chat/jake-chat";
import { Button } from "@/components/ui/button";
import { usePathname } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

export const JakeChatWidget = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === "/chat") {
    return null;
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {isOpen ? (
            <m.div
              key="jake-chat-widget-panel"
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn(
                "flex h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-border/80 bg-background/95 shadow-2xl shadow-black/20 backdrop-blur-xl",
                "sm:w-[420px]"
              )}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <JakeChat
                className="min-h-0 px-4 pb-4 pt-4"
                variant="widget"
                onClose={() => {
                  setIsOpen(false);
                }}
              />
            </m.div>
          ) : null}
        </AnimatePresence>

        <Button
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          className="size-12 rounded-full border border-border/70 bg-card text-foreground shadow-xl shadow-black/20 transition-transform hover:scale-105 hover:bg-card-02 active:scale-95"
          size="icon"
          type="button"
          onClick={() => {
            setIsOpen((open) => !open);
          }}
        >
          {isOpen ? (
            <X className="size-5" />
          ) : (
            <MessageCircle className="size-5" />
          )}
        </Button>
      </div>
    </LazyMotion>
  );
};

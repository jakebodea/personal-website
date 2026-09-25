"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import Link from "@/components/common/site-link";

import "./contact-link.css";

const randomUnit = (): number => {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] / 2 ** 32;
};

const generateRandomKeyframes = (): string => {
  const numSteps = Math.floor(randomUnit() * 15) + 15;
  const increments = Array.from(
    { length: numSteps },
    () => randomUnit() * 4 + 1
  );
  const total = increments.reduce((a, b) => a + b, 0);
  const normalized = increments.map((inc) => (inc / total) * 100);

  let keyframes = "0% { width: 0; }";
  let currentWidth = 0;
  for (const [index, increment] of normalized.entries()) {
    currentWidth += increment;
    const keyframePercent = ((index + 1) / numSteps) * 100;
    keyframes += ` ${keyframePercent.toFixed(1)}% { width: ${currentWidth.toFixed(1)}%; }`;
  }

  return keyframes;
};

interface ContactLinkProps {
  url: string;
  display: string;
  easterEgg?: string;
}

export const ContactLink = ({ url, display, easterEgg }: ContactLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [typingAnimationId, setTypingAnimationId] = useState("");
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const isEmail = url.startsWith("mailto:");
  const emailAddress = isEmail ? url.replace("mailto:", "") : "";
  const hasEasterEgg = easterEgg !== undefined && easterEgg !== "";

  const clearTypingAnimation = () => {
    setTypingAnimationId("");
    if (styleRef.current) {
      styleRef.current.remove();
      styleRef.current = null;
    }
  };

  const startTypingAnimation = () => {
    if (!hasEasterEgg) {
      return;
    }

    const suffix = randomUnit().toString(36).slice(2, 11);
    const animationId = `typing-${Date.now()}-${suffix}`;
    setTypingAnimationId(animationId);

    const keyframes = generateRandomKeyframes();
    const css = `@keyframes ${animationId} { ${keyframes} }`;

    if (styleRef.current) {
      styleRef.current.remove();
    }

    styleRef.current = document.createElement("style");
    styleRef.current.textContent = css;
    // oxlint-disable-next-line unicorn/prefer-dom-node-append -- document.head.append is typed as Workers Response.append in this project
    document.head.appendChild(styleRef.current);
  };

  useEffect(
    () => () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    },
    []
  );

  const handleEmailClick = () => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(emailAddress);
        toast.success("Email copied to clipboard!", {
          duration: 2000,
        });
      } catch {
        toast.error("Failed to copy email");
      }
    })();
  };

  const typingAnimationStyle =
    isHovered && typingAnimationId !== ""
      ? `${typingAnimationId} 0.6s linear forwards`
      : "none";

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        onMouseEnter={() => {
          setIsHovered(true);
          startTypingAnimation();
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          clearTypingAnimation();
        }}
        className="min-h-[3rem]"
      >
        <div className="flex items-center gap-2">
          <span className="text-accent/60">$</span>
          {isEmail ? (
            <button
              type="button"
              onClick={handleEmailClick}
              className="group text-left text-muted-foreground transition-colors hover:text-accent"
            >
              <span className="text-accent/70 group-hover:text-accent">
                copy
              </span>
              <span className="ml-2 group-hover:underline">{display}</span>
            </button>
          ) : (
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-muted-foreground transition-colors hover:text-accent"
            >
              <span className="text-accent/70 group-hover:text-accent">
                open
              </span>
              <span className="ml-2 group-hover:underline">{display}</span>
            </Link>
          )}
        </div>
        <div className="h-6 overflow-hidden">
          {hasEasterEgg && (
            <AnimatePresence>
              {isHovered && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {isEmail ? (
                    <button
                      type="button"
                      onClick={handleEmailClick}
                      className="flex items-center gap-2 py-1 text-left font-mono text-xs text-muted-foreground/70"
                    >
                      <span>#</span>
                      <span className="flex items-center">
                        <m.span
                          transition={{
                            duration: 0.6,
                            ease: "linear",
                          }}
                          className="inline-block overflow-hidden whitespace-nowrap"
                          style={{
                            animation: typingAnimationStyle,
                          }}
                        >
                          {easterEgg}
                        </m.span>
                        <m.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.1,
                            delay: 0.1,
                          }}
                          className="cursor-block"
                        />
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 font-mono text-xs text-muted-foreground/70"
                    >
                      <span>#</span>
                      <span className="flex items-center">
                        <m.span
                          transition={{
                            duration: 0.6,
                            ease: "linear",
                          }}
                          className="inline-block overflow-hidden whitespace-nowrap"
                          style={{
                            animation: typingAnimationStyle,
                          }}
                        >
                          {easterEgg}
                        </m.span>
                        <m.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.1,
                            delay: 0.1,
                          }}
                          className="cursor-block"
                        />
                      </span>
                    </Link>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </LazyMotion>
  );
};

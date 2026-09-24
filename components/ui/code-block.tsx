"use client";

import { Check, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CodeBlockProps {
  language: string;
  code: string;
}

const trimmedCode = (source: string) => source.replace(/\n$/u, "");

const subscribeToClientMount = (): (() => void) => () => {
  // useSyncExternalStore requires a subscribe function; client mount has no external events.
};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const CodeBlock = ({ language, code }: CodeBlockProps) => {
  const { theme } = useTheme();
  const [isCopied, setIsCopied] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeToClientMount,
    getClientSnapshot,
    getServerSnapshot
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      // Clipboard access can fail silently when permissions are denied.
    }
  };

  const syntaxTheme = theme === "dark" ? oneDark : oneLight;
  const displayCode = trimmedCode(code);

  if (!mounted) {
    return (
      <div className="relative my-6 rounded-lg border bg-muted/20">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="font-sans text-sm font-semibold text-muted-foreground">
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  disabled
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="scrollbar-thin !m-0 overflow-x-auto !rounded-none !bg-transparent !p-4">
          <pre
            className="scrollbar-thin !m-0 overflow-x-auto !rounded-none !bg-transparent !p-4"
            style={{ fontSize: "0.875rem" }}
          >
            <code>{displayCode}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative my-6 rounded-lg border bg-muted/20">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="font-sans text-sm font-semibold text-muted-foreground">
          {language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  void handleCopy();
                }}
                className="text-muted-foreground hover:bg-[#D5DDDF] hover:text-foreground active:bg-[#96AAAE] dark:hover:bg-accent/50 dark:active:bg-accent/70"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <SyntaxHighlighter
        style={syntaxTheme}
        language={language}
        PreTag="div"
        className="scrollbar-thin !m-0 overflow-x-auto !rounded-none !bg-transparent !p-4"
        customStyle={{
          fontSize: "0.875rem",
          margin: 0,
          padding: "1rem",
          borderRadius: 0,
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-mono)",
          },
        }}
      >
        {displayCode}
      </SyntaxHighlighter>
    </div>
  );
};

export { CodeBlock };

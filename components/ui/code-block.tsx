"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CodeBlockProps {
  language: string
  code: string
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const { theme } = useTheme()
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  const syntaxTheme = theme === "dark" ? oneDark : oneLight

  return (
    <div className="relative my-6 rounded-lg border bg-muted/20">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-sm font-sans font-semibold text-muted-foreground">
          {language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground hover:bg-[#D5DDDF] active:bg-[#96AAAE] dark:hover:bg-accent/50 dark:active:bg-accent/70"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
        className="!m-0 !p-4 !bg-transparent !rounded-none overflow-x-auto scrollbar-thin"
        customStyle={{
          fontSize: '0.875rem',
          margin: 0,
          padding: '1rem',
          backgroundColor: 'transparent',
          borderRadius: 0,
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-mono)",
          }
        }}
      >
        {String(code).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  )
} 
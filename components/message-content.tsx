"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

interface MessageContentProps {
  content: string
}

export function MessageContent({ content }: MessageContentProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="whitespace-pre-wrap">{content}</div>
  }

  return (
    <ReactMarkdown
      className={cn(
        "prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
        "max-w-none",
        "prose-code:before:hidden prose-code:after:hidden",
      )}
      components={{
        pre({ node, className, children, ...props }) {
          return (
            <pre className="mb-2 mt-2 overflow-auto rounded-lg bg-black/10 p-2 dark:bg-white/10" {...props}>
              {children}
            </pre>
          )
        },
        code({ node, className, children, ...props }) {
          return (
            <code className="rounded-sm bg-black/10 px-1 py-0.5 font-mono text-sm dark:bg-white/10" {...props}>
              {children}
            </code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
